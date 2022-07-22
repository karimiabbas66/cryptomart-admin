import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkRegistrationReportDetailComponent } from './bulk-registration-report-detail.component';

describe('BulkRegistrationReportDetailComponent', () => {
  let component: BulkRegistrationReportDetailComponent;
  let fixture: ComponentFixture<BulkRegistrationReportDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkRegistrationReportDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkRegistrationReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
