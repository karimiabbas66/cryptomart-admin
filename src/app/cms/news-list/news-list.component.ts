import {Component, OnInit, ViewChild} from '@angular/core';
import {Banner} from '../shared/dto/Banner';
import {News} from '../shared/dto/News';
import {ContentService} from '../shared/service/content.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {Personal} from '../../profile/shared/dto/Personal';
import {NewsLike} from '../shared/dto/NewsLike';
import {UserAccountService} from '../../leader-management/shared/service/UserAccountService';

@Component({
    selector: 'app-news-list',
    templateUrl: './news-list.component.html',
    styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {

    @ViewChild('ngbPagination', {static: false}) public ngbPagination: NgbPagination;
    data: News[];
    pageSize: number = 5;
    selectedField: News;
    totalRecords: number;
    userLikeNews: Personal[];
    userDisLikeNews: Personal[];
    selectedNewsId: number;

    countUserLikeNews: number = 0;
    countUserDisLikeNews: number = 0;

    loading: boolean;
    showProgress = false;

    constructor(private contentService: ContentService,
                private userAccountService: UserAccountService,
                private modalService: NgbModal,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.contentService.countAllNews().then((value: number) => {
            this.totalRecords = value;
            this.contentService.loadAllNews(0, this.pageSize).then(res => {
                this.data = res;
                this.showProgress = false;
            }).catch(err => {
                this.showProgress = false;
            })
        }).catch(err => {
            this.showProgress = false;
        })
    }

    loadNews(pageNumber: number) {
        this.showProgress = true;
        this.contentService.loadAllNews(pageNumber - 1, this.pageSize).then(value => {
            this.data = value;
            this.showProgress = false;
        }).catch(err => {
            this.showProgress = false;
        });
    }

    openUsersLikePage(content, item) {
        this.selectedNewsId = item;
        this.modalService.open(content, {size: 'lg', backdrop: 'static'}).result.then((result) => {
            this.findUsersLike(item, 0);
        }, (reason) => {
            this.modalService.dismissAll();
        });
    }

    countUsersLike(newsId) {
        this.contentService.countNewsLikeUsers(newsId).then((value: number) => {
            this.countUserLikeNews = value;
        }).catch(reason => {

        })
    }

    countUsersDisLike(newsId) {
        this.contentService.countNewsDisLikeUsers(newsId).then((value: number) => {
            this.countUserDisLikeNews = value;
        }).catch(reason => {

        })
    }

    findUsersLike(newsId, page) {
        this.contentService.newsLikeUsers(newsId, page, this.pageSize).then((value: string[]) => {
            this.userAccountService.findByUserIds(value, page, this.pageSize).then(likeUsers => {
                this.userLikeNews = likeUsers;
            }).catch(reason => {

            })
        }).catch(reason => {

        })
    }

    findUsersDisLike(newsId, page, size) {
        this.contentService.newsDisLikeUsers(newsId, page, size).then((value: string[]) => {
            this.userAccountService.findByUserIds(value, page, size).then(likeUsers => {
                this.userLikeNews = likeUsers;
            }).catch(reason => {

            })
        }).catch(reason => {

        })
    }

    removeNews(newsId: number) {
        swal.fire({
            title: 'آیا از حذف خبر اطمینان دارید؟',
            text: '!شما قادر به برگرداندن مورد حذف شده نخواهید بود',
            type: 'warning',
            showCancelButton: true,
            animation: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'انصراف',
            confirmButtonText: '!بله, حذف کن'
        }).then((result) => {
            if (result.value) {
                this.contentService.removeNews(newsId).then(res => {
                    this.contentService.countAllNews().then((value: number) => {
                        this.totalRecords = value;
                        this.ngbPagination.page = 1
                        this.contentService.loadAllNews(0, this.pageSize).then(res => {
                            this.data = res;
                            let setting: SweetAlertOptions = {};
                            setting.confirmButtonText = 'بستن';
                            setting.title = '!حدف شد';
                            setting.animation = true;
                            setting.text = '.خبر انتخاب شده حذف شد';
                            setting.type = 'success';
                            swal.fire(
                                setting
                            )
                        })
                    })
                }).catch(err => {
                    this.toastr.error(err.error.message);
                });
            }
        })
    }
}
