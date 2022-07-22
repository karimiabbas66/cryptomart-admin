import {Component, ViewContainerRef, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';
import {ChatService} from './communication/chat-ngrx/chat.service';
import {MessageService} from 'primeng/api';
import {PersonalService} from './profile/personal/personal.service';
import {AppSettings} from './pages/shared/AppSettings';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

    subscription: Subscription;
    targetUserId: string;
    subs = new Subscription();
    showToast = true;
    private currentAddress: string = AppSettings.CURRENTADDRESS;
    constructor(private router: Router,
                private messageService: MessageService,
                private personalService: PersonalService,
                private chatService: ChatService) {
    }

    ngOnInit() {
        this.subscription = this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd)
            )
            .subscribe(() => window.scrollTo(0, 0));
        this.subs.add(
        this.chatService.listen('message-notify').subscribe((data: any) => {
            if(data && data.header.senderType =='F'){
                console.log("notif comm", data)
                this.messageService.clear();
                console.log("here: ", data.header.fromUserId)
                if(this.showToast === true){
                    this.personalService.getPersonalInformation(data.header.fromUserId).then(res=>{
                        if(data.body.type==='text'){
                            this.messageService.add(
                                {
                                    severity: 'success',
                                    summary: res.userName,
                                    detail: data.body.message,
                                    life: 4000,
                                    data: {targetId: data.header.fromUserId, type:'F'}
                                })
                        } else if(data.body.type==='2'){
                            this.messageService.add(
                                {
                                    severity: 'success',
                                    summary: res.userName,
                                    detail: 'عکس',
                                    life: 4000,
                                    data: {targetId: data.header.fromUserId, type:'F'}
                                })
                        } else if(data.body.type==='3'){
                            this.messageService.add(
                                {
                                    severity: 'success',
                                    summary: res.userName,
                                    detail: 'صوت',
                                    life: 4000,
                                    data: {targetId: data.header.fromUserId, type:'F'}
                                })
                        } else if(data.body.type==='4'){
                            this.messageService.add(
                                {
                                    severity: 'success',
                                    summary: res.userName,
                                    detail: 'فیلم',
                                    life: 4000,
                                    data: {targetId: data.header.fromUserId, type:'F'}
                                })
                        }
                    })
                }
            } else
                {
                console.log("notif comm from Group", data)
                if(this.showToast === true){
                    this.personalService.getPersonalInformation(data.header.fromUserId).then(res=>{
                        if(data.body.type==='text'){
                            this.messageService.add(
                                {
                                    severity: 'success',
                                    summary: res.userName,
                                    detail: 'در گروه پیام ارسال کرد',
                                    life: 4000,
                                    data: {targetId: data.header.toUserId, type:'G'}
                                })
                        } else if(data.body.type==='2'){
                            this.messageService.add(
                                {
                                    severity: 'success',
                                    summary: res.userName,
                                    detail: 'در گروه عکس ارسال کرد',
                                    life: 4000,
                                    data: {targetId: data.header.toUserId, type:'G'}
                                })
                        } else if(data.body.type==='3'){
                            this.messageService.add(
                                {
                                    severity: 'success',
                                    summary: res.userName,
                                    detail: 'در گروه عکس صوت کرد',
                                    life: 4000,
                                    data: {targetId: data.header.toUserId, type:'G'}
                                })
                        } else if(data.body.type==='4'){
                            this.messageService.add(
                                {
                                    severity: 'success',
                                    summary: res.userName,
                                    detail: 'در گروه فیلم ارسال کرد',
                                    life: 4000,
                                    data: {targetId: data.header.toUserId, type:'G'}
                                })
                        }
                    })
                }
            }
        })
    )
    }


    ngOnDestroy() {
        // if (this.subscription) {
        //     this.subscription.unsubscribe();
        // }
    }


    onReject() {
        this.messageService.clear();
    }

    onConfirm(data: any) {
        this.messageService.clear();
        // window.location.href = this.currentAddress+'/communication/chat?id='+this.targetUserId;
        this.router.navigate(['/communication/chat'], {queryParams: {id: data.targetId, type:data.type}});
    }
}