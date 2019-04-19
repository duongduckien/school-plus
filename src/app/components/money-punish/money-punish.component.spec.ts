import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyPunishComponent } from './money-punish.component';

describe('MoneyPunishComponent', () => {
  let component: MoneyPunishComponent;
  let fixture: ComponentFixture<MoneyPunishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoneyPunishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyPunishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
