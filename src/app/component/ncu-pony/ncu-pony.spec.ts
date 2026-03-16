import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcuPony } from './ncu-pony';

describe('NcuPony', () => {
  let component: NcuPony;
  let fixture: ComponentFixture<NcuPony>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NcuPony],
    }).compileComponents();

    fixture = TestBed.createComponent(NcuPony);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
