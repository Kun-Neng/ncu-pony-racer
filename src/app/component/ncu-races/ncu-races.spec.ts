import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcuRaces } from './ncu-races';

describe('NcuRaces', () => {
  let component: NcuRaces;
  let fixture: ComponentFixture<NcuRaces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NcuRaces],
    }).compileComponents();

    fixture = TestBed.createComponent(NcuRaces);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
