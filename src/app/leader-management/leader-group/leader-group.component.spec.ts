import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderGroupComponent } from './leader-group.component';

describe('LeaderGroupComponent', () => {
  let component: LeaderGroupComponent;
  let fixture: ComponentFixture<LeaderGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaderGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
