import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeFieldRequestComponent } from './change-field-request.component';

describe('ChangeFieldRequestComponent', () => {
  let component: ChangeFieldRequestComponent;
  let fixture: ComponentFixture<ChangeFieldRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeFieldRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeFieldRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
