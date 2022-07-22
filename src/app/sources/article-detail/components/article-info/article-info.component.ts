import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ArticleModel} from '../../../shared/dto/article.model';
import {ArticleService} from '../../../shared/service/article.service';

@Component({
    selector: 'app-article-info',
    templateUrl: './article-info.component.html',
    styleUrls: ['./article-info.component.scss']
})
export class ArticleInfoComponent implements OnInit {

    public articleDetailForm: FormGroup;
    languages: any;
    keyWords: any[] = [];
    @Input() public article: ArticleModel;
    @Output() articleInfo: EventEmitter<any> = new EventEmitter<any>();

    constructor(private articleService: ArticleService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.articleDetailForm = this.formBuilder.group({
            title: new FormControl('', [Validators.required]),
            languageId: new FormControl('', [Validators.required]),
            doiNumber: new FormControl(''),
            totalPageNumber: new FormControl(''),
            articleAbstract: new FormControl(''),
            description: new FormControl(''),
            createDate: new FormControl(''),
            confirmed: new FormControl(''),
            // authorKeywords:new FormControl(''),
            authorKeywords: '',
        });
        this.languages = [{id: 0, name: ''}, {id: 1, name: 'فارسی'}, {id: 2, name: 'انگلیسی'}, {id: 3, name: 'عربی'}, {
            id: 4,
            name: 'سایر'
        }];
        if (!this.article || (this.article && this.article.languageId == null)) {
            this.article = {languageId: 1}
        }
    }

    edit() {
        this.article.authorKeywords = this.keyWords.map(key => key.value);
        this.articleInfo.emit(this.article)
    }
}
