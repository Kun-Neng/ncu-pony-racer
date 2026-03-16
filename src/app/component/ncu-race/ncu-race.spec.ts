import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcuRace } from './ncu-race';

describe('NcuRace', () => {
  let component: NcuRace;
  let fixture: ComponentFixture<NcuRace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NcuRace],
    }).compileComponents();

    fixture = TestBed.createComponent(NcuRace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
