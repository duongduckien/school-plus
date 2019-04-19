import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentListViewComponent } from './agent-list-view.component';

describe('AgentListViewComponent', () => {
  let component: AgentListViewComponent;
  let fixture: ComponentFixture<AgentListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
