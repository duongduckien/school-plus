import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentModalComponent } from './agent-modal.component';

describe('AgentModalComponent', () => {
  let component: AgentModalComponent;
  let fixture: ComponentFixture<AgentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
