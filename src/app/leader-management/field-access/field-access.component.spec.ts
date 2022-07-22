import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldAccessComponent } from './field-access.component';

describe('FieldAccessComponent', () => {
  let component: FieldAccessComponent;
  let fixture: ComponentFixture<FieldAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
