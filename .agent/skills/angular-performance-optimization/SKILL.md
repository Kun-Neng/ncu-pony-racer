---
name: angular-performance-optimization
description: "Angular 21 性能優化完整指南。使用場景：提升變更檢測性能、優化 Signals 和 RxJS 流、改善模板渲染效率、減少不必要的元件更新、實施 OnPush 策略、優化捆綁大小和記憶體使用。"
argument-hint: "描述需要優化的性能問題或要應用的優化策略"
---

# Angular 21 性能優化指南

## 何時使用

- 🐢 **應用反應緩慢** — 檢查變更檢測策略
- 🔄 **元件頻繁重新渲染** — 實施 OnPush 和 Signals
- 📦 **捆綁檔案過大** — 實現路由懶加載和樹搖優化
- 💾 **記憶體洩漏** — 正確管理訂閱和副作用
- ⚡ **需要優化最佳實踐** — 應用 Angular 21 現代模式

## 核心優化策略

### 1. ✅ 實施 OnPush 變更檢測策略

**為什麼重要**: OnPush 讓 Angular 僅在輸入屬性改變或事件發生時檢查元件，避免不必要的檢測週期。

**應用步驟**:

#### 第 1 步：添加 ChangeDetectionStrategy

```typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-my-component',
  imports: [CommonModule],
  templateUrl: './my-component.html',
  styleUrl: './my-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,  // ← 加這行
})
export class MyComponent {
  // ...
}
```

#### 第 2 步：使用 Signals 作為狀態

```typescript
import { signal } from '@angular/core';

export class MyComponent {
  // Signals 自動觸發 OnPush 更新
  count = signal(0);
  items = signal<Item[]>([]);
  
  increment() {
    this.count.update(c => c + 1);  // ✅ Signals 作為首選
  }
}
```

#### 第 3 步：對派生狀態使用 `computed()`

```typescript
import { computed } from '@angular/core';

export class MyComponent {
  count = signal(0);
  multiplier = signal(2);
  
  // ✅ 自動計算和快取
  result = computed(() => this.count() * this.multiplier());
}
```

**檔案更新時機表**:
```
所有 @Component 裝飾器 → 添加 changeDetection: ChangeDetectionStrategy.OnPush
依賴公開屬性的元件 → 改為 @Component 輸入 (input())
```

---

### 2. 🎯 優化 RxJS 數據流

**常見模式**:

#### A. 轉換 Observable 為 Signal

```typescript
// ❌ 舊做法：手動訂閱
ngOnInit() {
  this.raceService.list().subscribe(races => {
    this.races = races;
    this.cdr.markForCheck();  // 手動標記
  });
}

// ✅ 新做法：自動 OnPush 感知
races = toSignal(this.raceService.list(), { 
  initialValue: [] 
});
```

#### B. 使用 `switchMap` 處理路由參數

```typescript
import { switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

export class RaceDetailComponent {
  race = toSignal(
    this.activatedRoute.paramMap.pipe(
      switchMap(params => 
        this.raceService.getById(Number(params.get('raceId')))
      )
    ),
    { initialValue: null }
  );
}
```

#### C. 添加錯誤處理

```typescript
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

data = toSignal(
  this.apiService.fetchData().pipe(
    catchError(error => {
      console.error('Data fetch failed:', error);
      return of(null);
    })
  ),
  { initialValue: null }
);
```

#### D. 優化多訂閱場景

```typescript
// ✅ 使用 shareReplay() 避免重複請求
races$ = this.raceService.list().pipe(
  shareReplay(1)  // 快取最後一次結果
);

races = toSignal(this.races$, { initialValue: [] });
```

---

### 3. 📄 模板優化最佳實踐

#### A. 使用現代控制流（不用 `*ngIf` / `*ngFor`）

```html
<!-- ❌ 舊做法 -->
<div *ngIf="races">
  <div *ngFor="let race of races; let i = index">
    <h2>{{ race.name }}</h2>
  </div>
</div>

<!-- ✅ 新做法：更高效 -->
@if (races(); as raceList) {
  @for (race of raceList; track race.id) {
    <h2>{{ race.name }}</h2>
  }
} @else {
  <p>No races found</p>
}
```

**為什麼更高效**:
- `@for` 自動管理追蹤（優化 DOM 複用）
- 編譯時優化，減少運行時開銷
- 減少變更檢測週期

#### B. 使用 `track` 提高列表性能

```html
<!-- ✅ 好：基於唯一 ID 追蹤 -->
@for (pony of ponies(); track pony.id) {
  <div>{{ pony.name }}</div>
}

<!-- ⚠️ 避免：索引追蹤會重新渲染所有項目 -->
@for (pony of ponies(); track $index) {
  <div>{{ pony.name }}</div>
}
```

#### C. 類別和樣式綁定最佳實踐

```html
<!-- ❌ ngClass 較低效 -->
<div [ngClass]="{'active': isActive, 'disabled': isDisabled}">

<!-- ✅ class 綁定更快 -->
<div [class.active]="isActive" [class.disabled]="isDisabled">

<!-- ❌ ngStyle 較低效 -->
<div [ngStyle]="{'color': activeColor, 'background': bgColor}">

<!-- ✅ style 綁定更快 -->
<div [style.color]="activeColor" [style.background]="bgColor">
```

#### D. 管道和非同步操作

```html
<!-- ✅ 使用 async 管道自動訂閱/退訂 -->
<div>{{ data$ | async }}</div>

<!-- ✅ 使用 Signal 函式呼叫取得值 -->
<div>{{ data() }}</div>
```

---

### 4. 💾 記憶體管理和訂閱清理

#### A. 使用 `effect()` 進行副作用管理

```typescript
import { effect } from '@angular/core';

export class RaceComponent {
  raceId = signal<number | null>(null);
  
  constructor(private raceService: RaceService) {
    // ✅ 自動清理副作用
    effect(() => {
      const id = this.raceId();
      if (id) {
        this.loadRaceData(id);
      }
    });
  }
  
  private loadRaceData(id: number) {
    // 當 raceId 改變時自動執行
  }
}
```

#### B. 正確取消訂閱

```typescript
// ❌ 舊做法：手動管理
private destroy$ = new Subject<void>();

ngOnInit() {
  this.data$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}

ngOnDestroy() {
  this.destroy$.next();
}

// ✅ 新做法：使用 toSignal（自動清理）
data = toSignal(this.dataService.get(), { 
  initialValue: null 
});
```

#### C. 防止記憶體洩漏

```typescript
// ✅ 在 computed() 中避免副作用
protected readonly displayName = computed(() => {
  // ✅ 純計算，無副作用
  return this.firstName() + ' ' + this.lastName();
});

// ❌ 不要在 computed() 中做這些
protected readonly bad = computed(() => {
  localStorage.setItem('key', 'value');  // ❌ 副作用
  return this.data();
});
```

---

### 5. 🎨 元件輸入/輸出優化

#### A. 使用函式式 API

```typescript
// ❌ 舊做法：裝飾器
@Component({...})
export class MyComponent {
  @Input() ponyModel: PonyModel;
  @Output() ponyClicked = new EventEmitter<PonyModel>();
  
  onClick() {
    this.ponyClicked.emit(this.ponyModel);
  }
}

// ✅ 新做法：input()/output() 函式
import { input, output } from '@angular/core';

@Component({...})
export class MyComponent {
  ponyModel = input.required<PonyModel>();
  ponyClicked = output<PonyModel>();
  
  onClick() {
    this.ponyClicked.emit(this.ponyModel());
  }
}
```

**優點**:
- 型別安全
- 響應式（與 Signals 整合）
- 編譯時優化

#### B. 使用 `@HostBinding` → `host` 物件

```typescript
// ❌ 舊做法
import { HostBinding } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<button>Click me</button>`
})
export class ButtonComponent {
  @HostBinding('class') hostClass = 'btn-primary';
}

// ✅ 新做法：在 @Component 中使用 host
@Component({
  selector: 'app-button',
  template: `<button>Click me</button>`,
  host: {
    'class': 'btn-primary',
    '[attr.aria-label]': 'buttonLabel'
  }
})
export class ButtonComponent {
  buttonLabel = 'Submit button';
}
```

---

### 6. 📦 路由和代碼分割優化

#### A. 實現路由懶加載

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'races',
    // ✅ 懶加載功能模組
    loadComponent: () => import('./races/races.component').then(m => m.RacesComponent),
    loadChildren: () => import('./races/races.routes').then(m => m.RACES_ROUTES)
  }
];
```

#### B. 預載策略

```typescript
import { PreloadAllModules } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloadingStrategy(PreloadAllModules))
  ]
});
```

---

## 檢查清單：應用性能優化

### 階段 1：變更檢測（第一優先級）
- [ ] 所有 @Component 添加 `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] 用 Signal 替換公開屬性
- [ ] 使用 `computed()` 處理派生狀態
- [ ] 驗證所有子元件收到 Signal（不是普通物件）

### 階段 2：數據流優化（第二優先級）
- [ ] 用 `toSignal()` 轉換所有 Observable
- [ ] 添加 RxJS `catchError` 錯誤處理
- [ ] 在多訂閱服務中使用 `shareReplay()`
- [ ] 移除手動 `markForCheck()` 呼叫

### 階段 3：模板優化（第三優先級）
- [ ] 將 `*ngIf` 改為 `@if`
- [ ] 將 `*ngFor` 改為 `@for` 並設定 `track`
- [ ] 將 `[ngClass]` 改為 `[class.xxx]`
- [ ] 將 `[ngStyle]` 改為 `[style.xxx]`

### 階段 4：進階優化（第四優先級）
- [ ] 使用 `@HostBinding` → `host` 物件
- [ ] 用 `input()`/`output()` 函式替換裝飾器
- [ ] 實現路由懶加載
- [ ] 使用 `effect()` 管理副作用

### 階段 5：驗證和測試
- [ ] 執行性能審計 (Lighthouse)
- [ ] 檢查 Chrome DevTools 變更檢測
- [ ] 驗證 Core Web Vitals
- [ ] 執行單元測試確保功能完整

---

## 相關資源

- [Angular OnPush 官方文件](https://angular.dev/guide/change-detection)  
- [Angular Signals 官方文件](https://angular.dev/guide/signals)
- [RxJS 最佳實踐](https://www.learnrxjs.io/)
- [Angular 性能檢查清單](https://angular.dev/guide/performance)

---

## 常見問題

**Q: OnPush 會破壞我的應用嗎？**  
A: 不會。如果正確使用 Signals 和 `toSignal()`, OnPush 會讓你的應用 *更快*，因為不必要的檢測被消除。

**Q: 我應該何時使用 Signals vs Observables？**  
A: 用 Signals 處理本地元件狀態，用 Observables 處理異步流，然後用 `toSignal()` 橋接它們。

**Q: `computed()` 和 `derived()` 的區別？**  
A: `computed()` 用於同步派生，`derived()` 已過時，使用 `computed()`。

**Q: 懶加載會增加複雜性嗎？**  
A: 初期多一點設定，但長期顯著改善性能，特別是大型應用。
