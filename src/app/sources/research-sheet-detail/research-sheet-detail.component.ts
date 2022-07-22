import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResearchSheetDto} from '../shared/dto/ResearchSheetDto';
import {ResearchSheetService} from '../shared/service/research-sheet.service';
import {Personal} from '../../profile/shared/dto/Personal';
import {PersonalService} from '../../profile/personal/personal.service';
import {Subscription} from 'rxjs-compat/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {ResourceService} from '../shared/service/resource.service';
import {BookModel} from '../shared/dto/book.model';
import {ThesisModel} from '../shared/dto/thesis.model';
import {ArticleModel} from '../shared/dto/article.model';

@Component({
    selector: 'app-research-sheet-detail',
    templateUrl: './research-sheet-detail.component.html',
    styleUrls: ['./research-sheet-detail.component.scss']
})
export class ResearchSheetDetailComponent implements OnInit, OnDestroy {

    sheet: ResearchSheetDto = {};
    profile: Personal = {};
    subs = new Subscription();
    rating: number;
    book: BookModel = {};
    thesis: ThesisModel = {};
    article: ArticleModel = {};
    visitNumber: any;
    sendTableNumber: any;

    constructor(
        private bookResearchSheetService: ResearchSheetService,
        private route: ActivatedRoute,
        private router: Router,
        private resourceService: ResourceService,
        private personalService: PersonalService) {
    }

    ngOnInit() {
        this.subs.add(this.route.queryParams.subscribe(params => {
            this.sheet.researchSheetId = params['id'];
            this.bookResearchSheetService.findAllByResourceIdAndPersonalId(this.sheet.researchSheetId).then(value => {
                this.sheet = value;
                this.rating = this.sheet.rate;
                this.getResourceDetails(this.sheet.type);
                this.sheet.toPage = 50
                this.personalService.getPersonalInformation(this.sheet.creator).then(res => {
                    this.profile = res;
                })
            }).catch(reason => {

            });

            this.bookResearchSheetService.getContent(this.sheet.researchSheetId).then(value => {
                this.sheet.content = value;
            }).catch(reason => {

            });

            this.bookResearchSheetService.countAllVisitsByResearchSheetId(this.sheet.researchSheetId).then(value => {
                this.visitNumber = value;
            }).catch(reason => {

            });

            this.bookResearchSheetService.countAllSendTableByResourceSheetId(this.sheet.researchSheetId).then(value => {
                this.sendTableNumber = value;
            }).catch(reason => {

            });
        }));
    }

    getResourceDetails(resourceType) {
        if (this.sheet.type === 1) {
            this.resourceService.getBookModel(this.sheet.resourceId.toString()).then(value => {

                this.book = value;
            })
        } else if (this.sheet.type === 2) {
            this.resourceService.getThesisModel(this.sheet.resourceId.toString()).then(value => {

                this.thesis = value;
            })
        } else if (this.sheet.type === 3) {
            this.resourceService.getArticleModel(this.sheet.resourceId.toString()).then(value => {

                this.article = value;
            })
        }
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    goProfile() {
        this.router.navigate(['/profile/profile-detail'], {queryParams: {id: this.profile.id}});
    }
}
