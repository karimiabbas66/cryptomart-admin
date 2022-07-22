import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppSettings} from '../../pages/shared/AppSettings';
import {Subscription} from 'rxjs';
import {Personal} from '../../profile/shared/dto/Personal';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileManagerService} from '../../shared/file-manager.service';
import {ToastrService} from 'ngx-toastr';
import {PersonalService} from '../../profile/personal/personal.service';
import {AuthenticationRequestService} from '../../profile/authentication-request/share/service/AuthenticationRequest.service';
import {saveAs} from 'file-saver';
import {SheetReportListItem} from '../sheet-report-list/share/model/sheet-report-list-item';
import {ResearchSheetDto} from '../shared/dto/ResearchSheetDto';
import {ReportSheetService} from '../sheet-report-list/share/service/report-sheet.service';
import {ResearchSheetService} from '../shared/service/research-sheet.service';
import {ResourceService} from '../shared/service/resource.service';

@Component({
    selector: 'app-sheet-report-detail',
    templateUrl: './sheet-report-detail.component.html',
    styleUrls: ['./sheet-report-detail.component.scss']
})
export class SheetReportDetailComponent implements OnInit, OnDestroy {

    forShow: { fileId?: string, title?: string } = {};
    downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';

    subs = new Subscription();
    reqId: any;
    selectedReq: SheetReportListItem = {};
    selectedAdmin: Personal = {};
    selectedUser: Personal = {};
    selectedForShow: string;
    sheet: ResearchSheetDto = {};
    sourece: any = {};
    selectedTitle: any;
    selectedResId: any;

    constructor(private route: ActivatedRoute,
                private modalService: NgbModal,
                private fileManagerService: FileManagerService,
                private toa: ToastrService,
                private researchSheetService: ResearchSheetService,
                private router: Router,
                private resourceService: ResourceService,
                private personalService: PersonalService,
                private authService: ReportSheetService) {
    }

    ngOnInit() {
        this.subs.add(this.route.queryParams.subscribe(params => {
            this.reqId = params['id'];
            this.authService.findById(this.reqId).then(res => {
                this.selectedReq = res;
                this.researchSheetService.findAllByResourceIdAndPersonalId(this.selectedReq.researchSheetId).then(res => {
                    this.sheet = res;
                    if (this.sheet.type == 1) {
                        this.resourceService.getBookModel(this.sheet.resourceId.toString()).then(value => {

                            this.selectedTitle = value.title;
                            this.selectedResId = value.id;
                        })
                    } else if (this.sheet.type == 2) {
                        this.resourceService.getThesisModel(this.sheet.resourceId.toString()).then(value => {
                            this.selectedResId = value.id;
                            if (value.persianTitle) {
                                this.selectedTitle = value.persianTitle;
                            } else {
                                this.selectedTitle = value.englishTitle;
                            }
                        })
                    } else if (this.sheet.type == 3) {
                        this.resourceService.getArticleModel(this.sheet.resourceId.toString()).then(value => {
                            this.selectedTitle = value.title;
                            this.selectedResId = value.id;
                        })
                    }
                })
                this.fileManagerService.findByUUID(this.selectedReq.fileId).then(res5 => {
                    this.forShow.title = res5.fileName;
                    this.forShow.fileId = this.selectedReq.fileId
                })
                this.personalService.getPersonalInformation(this.selectedReq.createdBy).then(res1 => {
                    this.selectedUser = res1;
                })
                if (this.selectedReq.changeStatusBy) {
                    this.personalService.getPersonalInformation(this.selectedReq.changeStatusBy).then(res2 => {
                        this.selectedAdmin = res2;
                    })
                }

            })

        }))
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    goForSave() {

        if (this.selectedReq.status == null) {
            this.toa.error('لطفا درخواست را تایید و یا رد نمایید')
        } else if (this.selectedReq && this.selectedReq.status == false && this.selectedReq.description == null) {
            this.toa.error('لطفا توضیح رد کردن درخواست را وارد نمایید')
        } else {
            this.authService.changeStatus(this.selectedReq).then(res => {
                this.toa.success('ثبت شد')
                this.router.navigate(['/sources/sheet-report-list']);
            }, err => {
                this.toa.error(err.error.message)
            })
        }

    }

    showImage(fileId: string, content: any) {
        this.selectedForShow = fileId;
        this.modalService.open(content, {size: 'lg'});
    }

    goForDownload(fileId: string) {
        this.fileManagerService.findByUUID(fileId).then(res1 => {
            this.fileManagerService.getImage(fileId).subscribe(res => {
                saveAs(res, res1.fileName)
            })
        })
    }

    goTargetResource() {
        if (this.sheet.type === 1) {
            this.router.navigate(['/sources/book-detail'], {queryParams: {bookId: this.selectedResId}});
        } else if (this.sheet.type === 2) {
            this.router.navigate(['/sources/thesis-detail'], {queryParams: {thesisId: this.selectedResId}});
        } else if (this.sheet.type === 3) {
            this.router.navigate(['/sources/article-detail'], {queryParams: {articleId: this.selectedResId}});
        }

    }

    goTargetSheet() {
        this.router.navigate(['/sources/research-sheet-detail'], {queryParams: {id: this.sheet.researchSheetId}});
    }
}
