import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilPrintComponent } from './pupil-print.component';

describe('PupilPrintComponent', () => {
  let component: PupilPrintComponent;
  let fixture: ComponentFixture<PupilPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PupilPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PupilPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
