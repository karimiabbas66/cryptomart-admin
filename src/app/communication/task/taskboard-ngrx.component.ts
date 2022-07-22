import {
    Component,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    OnInit, OnDestroy,
} from '@angular/core';

import {Subscription} from 'rxjs';

import {TaskBoardService} from './taskboard-ngrx.service';
import {DragulaService} from 'ng2-dragula';
import {TaskStatusModel} from './share/model/taskStatus.model';
import {TaskEditModel} from './share/model/taskEdit.model';
import {PersonalService} from '../../profile/personal/personal.service';
import {FileManagerService} from '../../shared/file-manager.service';
import {AppSettings} from '../../pages/shared/AppSettings';
import {TaskSearchDto} from './share/model/TaskSearchDto';
import {Personal} from '../../profile/shared/dto/Personal';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-ngrx-taskboard',
    templateUrl: './taskboard-ngrx.component.html',
    styleUrls: ['./taskboard-ngrx.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskboardNGRXComponent implements OnInit,OnDestroy {

    @ViewChild('todoTitle', {static: false}) titleInputRef: ElementRef;
    @ViewChild('todoMessage', {static: false}) messageInputRef: ElementRef;
    subscription: Subscription;

    searchItem: TaskSearchDto[]=[];
    assigneeProfiles = new Map();
    private TASK_PER_PAGE = 100
    public todo: TaskEditModel[] = [];
    public inProcess: TaskEditModel[] = [];
    public backLog: TaskEditModel[] = [];
    public completed: TaskEditModel[] = [];
    public taskStatus: TaskStatusModel[] = [];

    taskTodoMore = {more: false, page: 0};
    taskInProgressMore = {more: false, page: 0};
    taskBackLogMore = {more: false, page: 0};
    taskCompleteMore = {more: false, page: 0};
    example: TaskEditModel = {};
    downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/'

    public taskCard: { from: string, to: string, selectedTaskId: number } =
        {from: undefined, to: undefined, selectedTaskId: undefined};
    showSearchPanel= false;
    creator: Personal = {};
    assignee: Personal = {};
    fromCreateDate: any;
    toCreateDate: any;
    subs = new Subscription();

    constructor(private elRef: ElementRef, private taskBoardService: TaskBoardService,
                private profileService: PersonalService,
                private toastService: ToastrService,
                private fileManagerService: FileManagerService,
                private dragulaService: DragulaService) {
    }

    ngOnInit() {
        this.taskBoardService.getAllTaskStatus().then(data => {
            this.taskStatus = data;
        })

        this.taskBoardService.getTaskByStatusId(1, 0).then(todo => {
            this.todo = todo;
            this.todo.forEach(item=>{
                this.profileService.getPersonalInformation(item.assignee).then(res=>{
                    this.assigneeProfiles.set(item.assignee, res);
                })
            })
            this.changeStateForMoreData(todo, this.taskTodoMore);

            this.taskBoardService.getTaskByStatusId(2, 0).then(inProgress => {
                this.inProcess = inProgress;
                this.inProcess.forEach(item=>{
                    this.profileService.getPersonalInformation(item.assignee).then(res=>{
                        this.assigneeProfiles.set(item.assignee, res);
                    })
                })
                this.changeStateForMoreData(inProgress, this.taskInProgressMore);

                this.taskBoardService.getTaskByStatusId(3, 0).then(backLog => {
                    this.backLog = backLog;
                    this.backLog.forEach(item=>{
                        this.profileService.getPersonalInformation(item.assignee).then(res=>{
                            this.assigneeProfiles.set(item.assignee, res);
                        })
                    })
                    this.changeStateForMoreData(backLog, this.taskBackLogMore);

                    this.taskBoardService.getTaskByStatusId(4, 0).then(complete => {
                        this.completed = complete;
                        this.completed.forEach(item=>{
                            this.profileService.getPersonalInformation(item.assignee).then(res=>{
                                this.assigneeProfiles.set(item.assignee, res);
                            })
                        })
                        this.changeStateForMoreData(complete, this.taskCompleteMore);
                    })
                })
            })
        })


        this.subs.add(this.dragulaService.drop('task-group').subscribe(data => {
            this.taskCard.from = data.source.getAttribute('list-name');
            this.taskCard.to = data.target.getAttribute('list-name');
            for (let status of this.taskStatus) {
                if (status.name == this.taskCard.to && (this.taskCard.from != this.taskCard.to)) {
                    this.taskBoardService.editTaskStatus(this.taskCard.selectedTaskId, status.id).then(result => {
                        this.toastService.info("تغییر وضعیت به " + this.resolveName(this.taskCard.to) + " انجام شد");
                    }).catch(err=>{
                        this.toastService.error("خطا در تغییر وضعیت وظیفه")
                    })
                }
            }
        }))
    };

    changeStateForMoreData(tasks: TaskEditModel[], stateModel) {
        if (tasks.length >= this.TASK_PER_PAGE) {
            stateModel.more = true;
            stateModel.page = stateModel.page + 1;
        } else {
            stateModel.more = false;
        }
    }

    getMoreTask(taskId: number) {

        if (taskId == 1) {
            this.taskBoardService.getTaskByStatusId(taskId, this.taskTodoMore.page).then(data => {
                this.todo.push(...data);
                this.changeStateForMoreData(data, this.taskTodoMore);
            })
        } else if (taskId == 2) {
            this.taskBoardService.getTaskByStatusId(taskId, this.taskInProgressMore.page).then(data => {
                this.inProcess.push(...data);
                this.changeStateForMoreData(data, this.taskInProgressMore);
            })
        } else if (taskId == 3) {
            this.taskBoardService.getTaskByStatusId(taskId, this.taskBackLogMore.page).then(data => {
                this.backLog.push(...data);
                this.changeStateForMoreData(data, this.taskBackLogMore);
            })
        } else if (taskId == 4) {
            this.taskBoardService.getTaskByStatusId(taskId, this.taskCompleteMore.page).then(data => {
                this.completed.push(...data);
                this.changeStateForMoreData(data, this.taskCompleteMore);
            })
        }
    }

    setItem(item: any) {
        this.taskCard.selectedTaskId = item.id;
    }

    taskDetail(id: number) {

    }

    resolveCardClass(priority: number) {
        if(priority == 1){
            return 'card-body todo-card pt-3';
        } else if(priority == 2){
            return 'complete-card card-body pt-3';
        } else {
            return 'card-body test-card pt-3';
        }
    }

    resetSearch() {
        this.example = {};
        this.showSearchPanel = false;
        this.ngOnInit();
    }

    onSearchItems() {
        if(this.fromCreateDate && this.toCreateDate && this.fromCreateDate >=this.toCreateDate){
            this.toastService.error("تاریخ پایان باید بزرگتر از تاریخ شروع باشد");
        } else {
            this.searchItem = [];
            if(this.example.assignee){
                let search: TaskSearchDto ={};
                search.key = "assignee";
                search.value = this.example.assignee;
                this.searchItem.push(search)
            }
            if(this.example.creator){
                let search: TaskSearchDto ={};
                search.key = "creator";
                search.value = this.example.creator;
                this.searchItem.push(search)
            }
            if(this.example.name){
                let search: TaskSearchDto ={};
                search.key = "name";
                search.value = this.example.name;
                this.searchItem.push(search)
            }
            if(this.example.id){
                let search: TaskSearchDto ={};
                search.key = "id";
                search.value = this.example.id;
                this.searchItem.push(search)
            }
            if(this.fromCreateDate){
                let search: TaskSearchDto ={};
                search.key = "fromDate";
                search.value = this.fromCreateDate;
                this.searchItem.push(search)
            }

            if(this.toCreateDate){
                let search: TaskSearchDto ={};
                search.key = "toDate";
                search.value = this.toCreateDate;
                this.searchItem.push(search)
            }

            this.taskBoardService.searchByItems(this.searchItem,  1, 0 ).then(todo => {
                this.todo = todo;
                this.todo.forEach(item=>{
                    this.profileService.getPersonalInformation(item.assignee).then(res=>{
                        this.assigneeProfiles.set(item.assignee, res);
                    })
                })
                this.changeStateForMoreData(todo, this.taskTodoMore);

                this.taskBoardService.searchByItems(this.searchItem,  2, 0 ).then(inProgress => {
                    this.inProcess = inProgress;
                    this.inProcess.forEach(item=>{
                        this.profileService.getPersonalInformation(item.assignee).then(res=>{
                            this.assigneeProfiles.set(item.assignee, res);
                        })
                    })
                    this.changeStateForMoreData(inProgress, this.taskInProgressMore);

                    this.taskBoardService.searchByItems(this.searchItem,  3, 0 ).then(backLog => {
                        this.backLog = backLog;
                        this.backLog.forEach(item=>{
                            this.profileService.getPersonalInformation(item.assignee).then(res=>{
                                this.assigneeProfiles.set(item.assignee, res);
                            })
                        })
                        this.changeStateForMoreData(backLog, this.taskBackLogMore);

                        this.taskBoardService.searchByItems(this.searchItem,  4, 0).then(complete => {
                            this.completed = complete;
                            this.completed.forEach(item=>{
                                this.profileService.getPersonalInformation(item.assignee).then(res=>{
                                    this.assigneeProfiles.set(item.assignee, res);
                                })
                            })
                            this.changeStateForMoreData(complete, this.taskCompleteMore);
                        })
                    })
                })
            })
        }
    }

    setCreator(event: Personal[]) {
        if(event[0]){
            this.example.creator = event[0].id;
            this.profileService.getPersonalInformation(this.example.creator).then(res=>{
                this.creator=res;
            })
        }
    }

    setAssignee(event: Personal[]) {
        if(event[0]){
            this.example.assignee = event[0].id;
            this.profileService.getPersonalInformation(this.example.assignee).then(res=>{
                this.assignee=res;
            })
        }
    }

    setFromDate(event: any) {
        this.fromCreateDate = event;
    }

    setToDate(event: any) {
        this.toCreateDate = event;
    }

    ngOnDestroy(): void {
        if(this.subs){
            this.subs.unsubscribe();
        }
    }

    private resolveName(to: string) {
        if(to == 'todo'){
            return '"صف وظایف"';
        } else if(to == 'inprogress'){
            return '"در حال انجام"';
        } else if(to == 'test'){
            return '"در حال تست"';
        } else {
            return '"تکمیل شده"';
        }
    }
}
