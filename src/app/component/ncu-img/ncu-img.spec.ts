import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcuImg } from './ncu-img';

describe('NcuImg', () => {
  let component: NcuImg;
  let fixture: ComponentFixture<NcuImg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NcuImg],
    }).compileComponents();

    fixture = TestBed.createComponent(NcuImg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
