import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TicketService} from '../shared/ticket.service';
import {TicketItemList} from '../shared/TicketItemList';
import {PersonalService} from '../../../profile/personal/personal.service';
import {AppSettings} from '../../../pages/shared/AppSettings';
import {FileManagerService} from '../../../shared/file-manager.service';
import {saveAs} from 'file-saver';
import {MessageService} from 'primeng/api';
import {Personal} from '../../../profile/shared/dto/Personal';
import {UserEntityService} from '../../../leader-management/shared/service/UserEntityService';
import {UserEntity} from '../../../leader-management/shared/dto/UserEntity';
import swal, {SweetAlertOptions} from 'sweetalert2';

let URL = AppSettings.UPLOAD_API_ENDPOINT + 'api/upload';


@Component({
    selector: 'app-ticket-details',
    templateUrl: './ticket-details.component.html',
    styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit, OnDestroy {

    private ticketParentId: any = null;
    subs = new Subscription();
    result: TicketItemList[] = []
    profile: TicketItemList = {};
    creator: TicketItemList = {};
    adminId: TicketItemList = {};
    totalRecords: any;
    tickets: TicketItemList[] = [];
    ticketMap = new Map();
    reply: TicketItemList = {};
    downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/';
    disableButton: boolean = true;
    fileName: string;
    placeholder: string = 'لطفا فایل را انتخاب و بارگذاری کنید';
    public isImageLoading = false;
    imageToShowLicense: any;
    isTicketParentClosed: boolean = false;
    adminGroups: UserEntity[];
    selectGroup: any;

    constructor(private  fileManagerService: FileManagerService,
                private router: Router,
                private route: ActivatedRoute,
                private ticketService: TicketService,
                private personalService: PersonalService,
                private userEntityService: UserEntityService,
                private toastr: MessageService) {
    }

    ngOnInit() {
        this.reply.description = '';
        this.reply.referType = null;
        this.selectGroup = 'انتخاب گروه';
        this.subs.add(this.route.queryParams.subscribe(params => {
            this.ticketParentId = params['id'];
            this.ticketService.getByParentId(this.ticketParentId).then(res => {
                this.profile = res;
                this.isTicketParentClosed = this.profile.isClosed;
            })

            this.userEntityService.getAllGroupByName('GROUP', '', 0, 50).then(value => {
                this.adminGroups = value;
            })

            this.ticketService.getAdminId().then(res => {
                console.log(res);
                this.adminId = res;
            })

            this.ticketService.getAllTicketsByParentId(this.ticketParentId).then(res => {
                this.tickets = res;
                this.tickets.forEach(item => {
                    if (!this.ticketMap.get(item.responsibleId)) {
                        this.personalService.getPersonalInformation(item.responsibleId).then(res => {
                            this.ticketMap.set(item.responsibleId, res);
                        })
                    }
                })
            })
        }))
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    afterUploadLicenses(event) {
        this.reply.fileUuid = event;
        this.getImageFromService(event);
    }


    getImageFromService(uuid) {
        this.ticketService.getImage(uuid).subscribe(data => {
            this.createImageFromBlob(data);
        }, error => {
            console.log(error);
        });
    }

    createImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener('load', () => {
            this.imageToShowLicense = reader.result;
            this.isImageLoading = true;
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    onSend(): void {
        this.reply.innerId = this.tickets[this.tickets.length - 1].id;
        this.reply.ticketParentId = this.ticketParentId;
        this.reply.responsibleId = this.adminId.responsibleId;
        console.log(this.reply);
        this.ticketService.replyToUser(this.reply).then(res => {
            if(this.reply.referredToId){
                this.router.navigate(['/communication/ticket-list']);
            }else {
                this.ngOnInit();
            }
        });
    }

    closeTicketParent(): void {
        swal.fire({
            title: 'آیا از بستن تیکت اطمینان دارید؟',
            text: '!شما قادر به دوباره باز کردن تیکت نخواهید بود',
            type: 'warning',
            showCancelButton: true,
            animation: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'انصراف',
            confirmButtonText: '!بله,  ببند'
        }).then(res => {
            if (res.value) {
                this.ticketService.closeTicketParent(this.ticketParentId).then(res => {
                    // this.toastr.add({severity:'success', summary:'موفق', detail:'ثبت شد'});
                    this.ngOnInit();
                    let setting: SweetAlertOptions = {};
                    setting.confirmButtonText = 'بستن';
                    setting.title = '!بسته شد';
                    setting.animation = true;
                    setting.text = '.تیکت انتخاب شده بسته شد';
                    setting.type = 'success';
                    swal.fire(
                        setting
                    )
                }).catch(reason => {
                    this.toastr.add({severity: 'error', summary: 'نا موفق', detail: 'ثبت با خطا مواجه شد'});
                })
            }
        })
    }

    goForDownload(fileUuid: string) {
        this.fileManagerService.findByUUID(fileUuid).then(res1 => {
                this.fileManagerService.getImage(fileUuid).subscribe(res => {
                    saveAs(res, res1.fileName)
                })
            }
        )
    }

    setReferredToAndBy(event: Personal[]) {
        if (event[0]) {
            this.reply.referredById = this.adminId.responsibleId;
            this.reply.referredToId = event[0].id;
        }
    }

    markAsUnread() {
        this.ticketService.markAsUnread(this.ticketParentId).then(res => {
            this.toastr.add({severity: 'success', summary: 'موفق', detail: 'ثبت شد'});
        }).catch(err => {
            this.toastr.add({severity: 'error', summary: 'نا موفق', detail: 'ثبت با خطا مواجه شد'});
        })
    }

    changeAdminGroup(group: UserEntity) {
        this.selectGroup = group.name;
        this.reply.referredToId = group.userEntityId.toString();

    }
}
