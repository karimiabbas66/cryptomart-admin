import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ContentService} from '../shared/service/content.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {StaticPage} from '../shared/dto/StaticPage';
import {Subscription} from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-static-page-detail',
  templateUrl: './static-page-detail.component.html',
  styleUrls: ['./static-page-detail.component.scss']
})
export class StaticPageDetailComponent implements OnInit, OnDestroy {
  public pageId: number;
  public pageDetailForm: FormGroup;
  public page: StaticPage = {};
  subs = new Subscription();


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'محتوا را وارد کنید ...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  constructor(private contentService: ContentService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.pageDetailForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),

    });

    this.subs.add(this.route.queryParams.subscribe(params => {
      this.pageId = params['id'];
      if (this.pageId) {
        this.contentService.findPageById(this.pageId).then(res => {
          this.page = res;
        });
      }
    }))

  }


  edit() {
    this.contentService.saveStaticPage(this.page).then(res => {
      this.toastr.success('صفحه با موفقیت ثبت شد');
      this.pageDetailForm.reset();
      this.router.navigate(['/cms/static-page-list']);
    }).catch(err => {
      this.toastr.error(err.error.message);
    });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


}
