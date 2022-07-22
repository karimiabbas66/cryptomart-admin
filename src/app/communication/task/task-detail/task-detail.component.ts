import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TaskDetailService} from './task-detail.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs-compat/Subscription';
import {_priority} from '../share/model/priority.type';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LogWorkModel} from '../share/model/logWork.model';
import {PersianCalendarService} from '../../../shared/services/persian-calendar.service';
import {CommentService} from '../share/service/comment.service';
import {CommentList} from '../../../shared/comment/comment.model';
import {FileManagerService} from '../../../shared/file-manager.service';
import {Personal} from '../../../profile/shared/dto/Personal';
import {PersonalService} from '../../../profile/personal/personal.service';
import {TaskEditModel} from '../share/model/taskEdit.model';
import {FileInfoModel} from '../../../shared/model/file-info.model';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {saveAs} from 'file-saver';
import {AuthService} from '../../../shared/auth/auth.service';
import {AppSettings} from '../../../pages/shared/AppSettings';

@Component({
    selector: 'app-task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.scss']
})

export class TaskDetailComponent implements OnInit, OnDestroy {

    username = '';
    firstName = '';
    lastName = '';
    code = '';
    phone = '';

    taskId: number;
    task: TaskEditModel = {};
    priority = _priority;
    taskForm: FormGroup;
    logForm: FormGroup;

    logWorks: LogWorkModel[] = [];
    comments: CommentList[] = [];
    downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/'

    duration: { hour: number, second: number } = {hour: undefined, second: undefined};

    public datePick: number;
    private subscription: Subscription = new Subscription();

    link2: number;

    _assignName: any;
    _priorityName: any;
    uploaderPlaceholder: 'فایل ضمیمه';
    imageToShow: any;
    isCreatorImageLoading: boolean = false;
    isAssigneeImageLoading: boolean = false;
    profileCreator: Personal = {};
    profileAssignee: Personal = {};
    files: FileInfoModel[] = [];
    showUpload = false;
    creatorPhotoImage: any;
    assigneePhotoImage: any;
    logs = new Map();
    showDelete = false;
    showComment = true;
    // hour: number = 0;
    // second: number = 0;

    @ViewChild('comment', {static: false}) public comment: ElementRef;
    @ViewChild('log', {static: false}) public log: ElementRef;
    currentUserId: string;

    constructor(private taskDetailService: TaskDetailService,
                private route: ActivatedRoute, private builder: FormBuilder,
                private profileService: PersonalService,
                public persianCalendarService: PersianCalendarService,
                private toastr: ToastrService,
                private router: Router,
                private modalService: NgbModal,
                public fileManagerService: FileManagerService,
                private authService: AuthService,
                public commentService: CommentService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.taskId = params['id'];
            if (this.taskId) {
                this.taskDetailService.getTask(this.taskId).then(data => {
                    this.task = data;
                    this.task.attachments.forEach(item => {
                        this.fileManagerService.findByUUID(item).then(res => {
                            this.files.push(res);
                        })
                    })
                    this.currentUserId = this.authService.getCurrentUUID();
                    this.taskDetailService.getAllLogWorksForTask(this.taskId).then(data => {
                        this.logWorks = data;
                        if(this.logWorks.length>0){
                            this.showDelete = false;
                        } else if(this.authService.getCurrentUUID() == this.task.creator) {
                            this.showDelete = true;
                        }
                        this.logWorks.forEach(item=>{
                            if(!this.logs.get(item.creator)){
                                this.profileService.getPersonalInformation(item.creator).then(res=>{
                                    this.logs.set(item.creator, res);
                                })
                            }
                        })
                    }).catch(err => {
                        this.toastr.error(err.error.message);
                    })
                    this.profileService.getPersonalInformation(this.task.creator).then(res => {
                        this.profileCreator = res;
                        this.logs.set(this.task.creator, res);
                    }).catch(err => {
                        this.toastr.error(err.error.message);
                    })
                    this.profileService.getPersonalInformation(this.task.assignee).then(res => {
                        this.profileAssignee = res;
                        this.logs.set(this.task.assignee, res);
                    }).catch(err => {
                        this.toastr.error(err.error.message);
                    })
                    // this.commentService.getCommentsByTaskId(this.taskId).then(c => {
                    //     this.comments = c;
                    // }).catch(err=>{
                    //     this.toastr.error(err.error.message);
                    // })

                    this._priorityName = this.priority.filter(priority => priority.code == this.task.priority)[0];

                });
            } else {
                this.task.attachments = [];
                this.profileService.getPersonalInformation(this.authService.getCurrentUUID()).then(res=>{
                    this.profileCreator = res;
                    this.task.creator = res.id;
                })
            }
        })

        this.taskForm = this.builder.group({
            name: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
            priority: new FormControl(null, [Validators.required]),
            link: new FormControl(null),
            link2: new FormControl(null),
            assignee: new FormControl(null, []),
            attachments: new FormControl(null),
            // // zone: new FormControl(null),
        })

        this.logForm = this.builder.group({
            'hour': new FormControl(null, [Validators.required, Validators.max(23)]),
            'second': new FormControl(null, [Validators.required, Validators.max(59)])
        })

        this.subscription.add(
            this.taskForm.get('priority').valueChanges.subscribe(value => {
                if (value != undefined) {
                    this.task.priority = value.code;
                }
            })
        );
    }

    showInputComment(id: any) {
        let currentElement = document.getElementById(id);
        if (currentElement.style.display == 'none') {
            currentElement.style.display = 'block';
        } else {
            currentElement.style.display = 'none';
        }
    }


    editTask() {
        console.log("task is: ", this.task)
        if (this.taskId) {
            this.task.statusId = this.task.status.id;
            this.taskDetailService.editTask(this.task).then(data => {
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = 'با موفقیت ثبت شد';
                setting.animation = true;
                setting.text = 'وظیفه مورد نظر ویرایش شد';
                setting.type = 'success';
                swal.fire(
                    setting
                )
                this.taskDetailService.getTask(this.taskId).then(task => {
                    this.task = task;
                }).catch(err => {
                    this.toastr.error(err.error.message);
                })
            }).catch(err => {
                this.toastr.error(err.error.message);
            })
        } else {
            this.task.statusId = 1;
            this.taskDetailService.createTask(this.task).then(data => {
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = 'با موفقیت ایجاد شد';
                setting.animation = true;
                setting.text = 'وظیفه مورد نظر ایجاد شد';
                setting.type = 'success';
                swal.fire(
                    setting
                )
                this.router.navigate(['/communication/task-list']);
            })
        }

    }

    addLog() {
        let log: LogWorkModel = {};
        log.duration = this.duration.second + 60 * this.duration.hour;
        log.workDate = this.datePick;
        log.taskId = this.task.id;
        log.creator = this.task.creator;

        this.taskDetailService.createLogWork(log).then(result => {
            this.taskDetailService.getAllLogWorksForTask(this.taskId).then(data => {
                this.logWorks = data;
                if(data.length > 0){
                    this.showDelete = false;
                } else if(this.authService.getCurrentUUID() == this.task.creator){
                    this.showDelete = true;
                }
                this.logWorks.forEach(item=>{
                    if(!this.logs.get(item.creator)){
                        this.profileService.getPersonalInformation(item.creator).then(res=>{
                            this.logs.set(item.creator, res);
                        })
                    }
                })
            }).catch(err => {
                this.toastr.error(err.error.message);
            })
        })
    }

    deleteLogWork(id: number) {
        this.taskDetailService.deleteLogWork(id).then(result => {
            this.taskDetailService.getAllLogWorksForTask(this.taskId).then(data => {
                this.logWorks = data;
                if(data.length > 0){
                    this.showDelete = false;
                } else if(this.authService.getCurrentUUID() == this.task.creator){
                    this.showDelete = true;
                }
                this.toastr.info("حذف با موفقیت انجام شد")
            }).catch(err => {
                this.toastr.error(err.error.message);
            })
        }).catch(err => {
            this.toastr.error(err.error.message);
        })
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    afterUploadFile(event) {
        let uploaded: FileInfoModel = {};
        this.fileManagerService.findByUUID(event).then(res => {
            uploaded = res;
            this.files.push(uploaded)
            this.task.attachments.push(event);
            this.showUpload = !this.showUpload;
            this.modalService.dismissAll();
        }).catch(err => {
            this.toastr.error(err.error.message);
        })
    }

    getResult(event: Personal[]) {
        this.task.assignee = event[0].id;
        this.profileService.getPersonalInformation(this.task.assignee).then(res=>{
            this.profileAssignee = res;
        })
    }

    setStartDate(event: any) {
        this.datePick = event
    }

    removeFileAttach(item: FileInfoModel) {
        this.files.splice(this.files.indexOf(item), 1);
        let number = this.task.attachments.indexOf(item.uuid);
        this.task.attachments.splice(number, 1)
    }

    goForDownload(item: FileInfoModel) {
        this.fileManagerService.getImage(item.uuid).subscribe(res => {
            saveAs(res, item.fileName)
        })
    }

    goForDelete() {
        swal.fire({
            title: 'آیا از حذف وظیفه اطمینان دارید؟',
            text: '!شما قادر به برگرداندن مورد حذف شده نخواهید بود',
            type: 'warning',
            showCancelButton: true,
            animation: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'انصراف',
            confirmButtonText: '!بله, حذف کن'
        }).then((result)=>{
            if(result.value){
                this.taskDetailService.deleteTask(this.taskId).then(res=>{
                    let setting: SweetAlertOptions = {};
                    setting.confirmButtonText = 'بستن';
                    setting.title = 'با موفقیت حذف شد';
                    setting.animation = true;
                    setting.text = 'وظیفه مورد نظر حذف شد';
                    setting.type = 'success';
                    swal.fire(
                        setting
                    )
                    this.router.navigate(['/communication/task-list']);
                })
            }
        })
    }

    setThreadId(event: any) {
        this.task.threadId = event;


        if (this.taskId) {
            this.task.statusId = this.task.status.id;
            this.taskDetailService.editTask(this.task).then(data => {
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = 'ثبت اولین نظر برای وظیفه';
                setting.animation = true;
                setting.text = 'اولین نظر برای این وظیفه ایجاد شد';
                setting.type = 'success';
                swal.fire(
                    setting
                )
                this.taskDetailService.getTask(this.taskId).then(task => {
                    this.task = task;
                }).catch(err => {
                    this.toastr.error(err.error.message);
                })
            }).catch(err => {
                this.toastr.error(err.error.message);
            })
        }
    }

    openIt(comment: string) {
        if(comment == 'log'){
            this.showComment = false;
            this.comment.nativeElement.style.backgroundColor = '#c3c7c7';
            this.log.nativeElement.style.backgroundColor = '#3f9ea1';
        } else {
            this.showComment = true;
            this.comment.nativeElement.style.backgroundColor = '#3f9ea1';
            this.log.nativeElement.style.backgroundColor = '#c3c7c7';
        }

    }

    keyPressSecond(event: any) {
        this.duration.second = this.logForm.get('second').value;
        if(this.duration && this.duration.second && this.duration.second.toString() &&
            +(this.duration.second.toString() + event.key.toString()) > 59){
            return false;
        }

        if(this.duration && this.duration.second && this.duration.second.toString() &&
            this.duration.second.toString() != null){
            this.logForm.get('hour').setValidators(Validators.nullValidator);
        }
        return event.key>=0;
    }

    keyPressHour(event: any) {
        this.duration.hour = this.logForm.get('hour').value;
        if(this.duration && this.duration.hour && this.duration.hour.toString() &&
                +(this.duration.hour.toString() + event.key.toString()) > 23){
                return false;
        }

        if(this.duration && this.duration.hour && this.duration.hour.toString() &&
            this.duration.hour.toString() != null){
            this.logForm.get('second').setValidators(Validators.nullValidator);
        }
            return event.key>=0;
    }
}
