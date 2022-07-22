import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleFileComponent } from './article-file.component';

describe('BookFileComponent', () => {
  let component: ArticleFileComponent;
  let fixture: ComponentFixture<ArticleFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
