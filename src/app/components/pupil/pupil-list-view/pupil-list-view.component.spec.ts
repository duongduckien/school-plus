import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilListViewComponent } from './pupil-list-view.component';

describe('PupilListViewComponent', () => {
  let component: PupilListViewComponent;
  let fixture: ComponentFixture<PupilListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PupilListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PupilListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
