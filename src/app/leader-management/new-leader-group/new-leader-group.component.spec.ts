import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeaderGroupComponent } from './new-leader-group.component';

describe('NewLeaderGroupComponent', () => {
  let component: NewLeaderGroupComponent;
  let fixture: ComponentFixture<NewLeaderGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeaderGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeaderGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
