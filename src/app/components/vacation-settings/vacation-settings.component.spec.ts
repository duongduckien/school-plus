import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationSettingsComponent } from './vacation-settings.component';

describe('VacationSettingsComponent', () => {
  let component: VacationSettingsComponent;
  let fixture: ComponentFixture<VacationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
