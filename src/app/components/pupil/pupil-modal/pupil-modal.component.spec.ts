import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilModalComponent } from './pupil-modal.component';

describe('PupilModalComponent', () => {
  let component: PupilModalComponent;
  let fixture: ComponentFixture<PupilModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PupilModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PupilModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
