import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {Subscription, throwError} from 'rxjs';
import {ChatService} from './chat.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {UserModel} from './dto/user.model';
import {v4 as uuidv4} from 'uuid';
import {MessageModel} from './dto/message.model';
import {GroupModel} from './dto/group.model';
import {PersonalService} from '../../profile/personal/personal.service';
import {AppSettings} from '../../pages/shared/AppSettings';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../shared/auth/auth.service';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import set = Reflect.set;
import {GeneralNotification} from './chat.notification'
import {ToastrService} from 'ngx-toastr';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Personal} from '../../profile/shared/dto/Personal';
import {ChatGroupItem} from './store/chat-group-item';

let URL = AppSettings.UPLOAD_API_ENDPOINT + 'api/upload';


@Component({
    selector: 'app-ngrx-chat',
    templateUrl: './chat-ngrx.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./chat-ngrx.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
    private currentActive: string;
    private selectedUser: UserModel = {};
    public selectedType: string;
    typeOfPageUrl: any;

    ngAfterViewInit(): void {
        this.chatService.disconnect();
        this.chatService.runIt();
        this.runApp();
    }

    user: string = null;
    selectedContact: { id: string, type: string } = {id: null, type: null};
    userMessages = {};

    userInfo: UserModel = null
    chatUsers: UserModel[] = []
    chatGroups: GroupModel[] = []
    map = new Map()

    activeChatUserImg: string;
    downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/'
    jwt: string = '';
    subscription: Subscription;
    @ViewChild('messageInput', {static: false}) messageInputRef: ElementRef;
    @ViewChild('chatSidebar', {static: false}) sidebar: ElementRef;
    @ViewChild('contentOverlay', {static: false}) overlay: ElementRef;
    @ViewChild('uploadfile', {static: false}) uploadFile: ElementRef;
    @ViewChild('uploadfile2', {static: false}) uploadFile2: ElementRef;
    @ViewChild('uploadfile3', {static: false}) uploadFile3: ElementRef;

    messages = new Array();
    item: number = 0;
    mainChat: MessageModel[];
    subs = new Subscription();
    private lastAcitveId: string;
    targetId: any;
    targetUserId: string;
    chatFileType: any = 'text';

    constructor(private elRef: ElementRef, private renderer: Renderer2,
                private changeDetectionRef: ChangeDetectorRef,
                private route: ActivatedRoute,
                private authService: AuthService,
                private personalService: PersonalService,
                private http: HttpClient,
                private router: Router,
                private toa: ToastrService,
                private modalService: NgbModal,
                private messageService: MessageService,
                private chatService: ChatService) {
    }

    ngOnInit() {
        this.targetId = '';
        this.fileType = '*';
        this.disableText = true;
        this.currentuserId = this.authService.getCurrentUUID();
        this.subs.add(this.route.queryParams.subscribe(params => {
            this.targetId = params['id'];
            this.typeOfPageUrl = params['type'];
            // this.chatService.runIt();
            setTimeout(() => {
            }, 1000)
            setTimeout(() => {
                if (this.targetId && this.typeOfPageUrl === 'F') {
                    this.SetActive(null, this.targetId, 'F', true);
                } else if(this.targetId && this.typeOfPageUrl === 'G'){
                    this.SetActive(null,this.targetId, 'G', null)
                }
                this.detectChange();
            }, 2000)
        }));
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }

    onSidebarToggle() {
        this.renderer.removeClass(this.sidebar.nativeElement, 'd-none');
        this.renderer.removeClass(this.sidebar.nativeElement, 'd-sm-none');
        this.renderer.addClass(this.sidebar.nativeElement, 'd-block');
        this.renderer.addClass(this.sidebar.nativeElement, 'd-sm-block');
        this.renderer.addClass(this.overlay.nativeElement, 'show');
    }

    onContentOverlay() {
        this.renderer.removeClass(this.overlay.nativeElement, 'show');
        this.renderer.removeClass(this.sidebar.nativeElement, 'd-block');
        this.renderer.removeClass(this.sidebar.nativeElement, 'd-sm-block');
        this.renderer.addClass(this.sidebar.nativeElement, 'd-none');
        this.renderer.addClass(this.sidebar.nativeElement, 'd-sm-none');
    }

    makeConnection() {
        let helper = new JwtHelperService();
        this.user = helper.decodeToken(this.jwt).sub;
        this.chatService.emit('join', this.jwt);
        console.log(this.user)
        this.jwt = '';
    }

    //send button function calls
    onAddMessage(messageType = 'text') {
        let messageContent = this.messageInputRef.nativeElement.value;
        let message = new MessageModel(null, messageContent, this.userInfo.id, this.selectedContact.id, Date.now(), messageType, uuidv4())
        this.chatService.emit('message', message);
        this.messageInputRef.nativeElement.value = '';

        //TODO wrong approach!!!!
        // for add one message need iterate over all users and groups
        this.chatUsers.forEach(u => {
            if (u.id === this.selectedContact.id) {
                message.side = 'right'
                u.messages.push(message)
                this.detectChange();
            }
        })

        this.chatGroups.forEach(g => {
            if (g.id === this.selectedContact.id) {
                message.side = 'right'
                g.messages.push(message)
                this.detectChange();
            }
        })
        this.messageInputRef.nativeElement.focus();
    }

    public addEmoji(event) {
        this.messageInputRef.nativeElement.value = `${this.messageInputRef.nativeElement.value}${event.emoji.native}`;
        this.isEmojiPickerVisible = false;
    }

    //chat user list click event function
    chat: any;
    isEmojiPickerVisible: any;
    disableText: any = true;
    showUpMenu = false;
    fileType: any = '*';

    SetActive(event, selectedId: string, type: string, isActive: boolean) {
        if(!this.targetId || this.targetId != selectedId){
            this.router.navigate(['/communication/chat'], {queryParams: {id: selectedId, type:type}});
        }
        console.log('selected: ', selectedId + 'with type of: ', type)
        console.log('selected: ', 'userid', selectedId)
        this.selectedType=type;
        if (!this.currentActive || this.currentActive !== selectedId) {
            this.currentActive = selectedId;
            this.disableText = false;
            this.mainChat = [];
            this.lastAcitveId = null;
            this.selectedContact.id = selectedId
            this.selectedContact.type = type

            if (type === 'F') {
                this.chatUsers.forEach(u => {
                    if (u.id === this.selectedContact.id) {
                        this.selectedUser = u;
                    }
                })
            }
            if (type === 'G') {
                this.chatGroups.forEach(u => {
                    if (u.id === this.selectedContact.id) {
                        this.selectedUser = u;
                    }
                })
                this.chatService.getGroupInfo(this.selectedContact.id).then(res=>{
                    this.groupInfo = res;
                })

            }

            if (!isActive) {
                if (!this.selectedUser.messages || this.selectedUser.messages.length === 0) {
                    this.moreMessage();
                } else {
                    this.chatUsers.forEach(u => {
                        if (u.id === this.selectedContact.id) {
                            this.mainChat = u.messages;
                            console.log('it is: ', this.mainChat);
                        }
                    })
                    if (this.mainChat && this.mainChat.length > 0) {
                        this.lastAcitveId = this.mainChat[0].uuid;
                    }
                    this.detectChange();
                }
            } else {
                console.log(this.selectedContact)
                this.chatService.emit('read', this.selectedContact)
                setTimeout(() => {
                    if (!this.selectedUser.messages || this.selectedUser.messages.length === 0) {
                        this.moreMessage();
                    } else {
                        if (this.selectedContact.type === 'G') {
                            this.chatGroups.forEach(g => {
                                if (g.id === this.selectedContact.id) {
                                    this.mainChat = g.messages;
                                    console.log('it is: ', this.mainChat);
                                }
                            })
                            this.mainChat.map(item=>{
                                if(item.fromUserId == this.userInfo.id){
                                    item.side = 'right'
                                } else {
                                    item.side = 'left'
                                }
                            })
                            if (this.mainChat && this.mainChat.length > 0) {
                                this.lastAcitveId = this.mainChat[0].uuid;
                            }
                        }
                        if (this.selectedContact.type === 'F') {
                            this.chatUsers.forEach(u => {
                                if (u.id === this.selectedContact.id) {
                                    this.mainChat = u.messages;
                                    console.log('it is: ', this.mainChat);
                                }
                            })
                            if (this.mainChat && this.mainChat.length > 0) {
                                this.lastAcitveId = this.mainChat[0].uuid;
                            }
                        }
                        this.detectChange();
                    }
                }, 500)

                var hElement: HTMLElement = this.elRef.nativeElement;
                //now you can simply get your elements with their class name
                var allAnchors = hElement.getElementsByClassName('list-group-item');

                //do something with selected elements
                [].forEach.call(allAnchors, function (item: HTMLElement) {
                    item.setAttribute('class', 'list-group-item no-border');
                });
                //set active class for selected item
                if (event) {
                    event.currentTarget.setAttribute('class', 'list-group-item bg-blue-grey bg-lighten-5 border-right-primary border-right-2');
                }
            }
        }
    }

    moreMessage() {
        if (this.selectedContact.id !== null) {
            console.log('last active is: ', this.lastAcitveId)
            let readDate = {id: this.selectedContact.id, uuid: this.lastAcitveId}
            this.chatService.emit('read-db', readDate);
        } else {
            console.log('Choose Person For Chat')
        }
    }

    keyPress(event: any) {
        console.log('any is: ', event)
    }

    private runApp() {
        this.subs.add(this.chatService.listen('join-notify').subscribe((data: string) => {
            console.log(`UserId ${data} Joined`);
            this.chatUsers.forEach(c => c.id === data ? c.isActive = true : c.isActive);
            this.detectChange();
        }))
        this.subs.add(this.chatService.listen('leave-notify').subscribe((data) => {
            console.log(`UserId ${data} Left`);
            this.chatUsers.forEach(c => c.id === data ? c.isActive = false : c.isActive)
            this.detectChange();
        }))
        this.subs.add(this.chatService.listen('friend-group').subscribe((data: any[]) => {
            console.log(data)
            data.forEach(u => {
                if (u.type === 'G') {
                    let existIndex = this.chatGroups.findIndex(f => f.id === u.id)
                    if (existIndex !== -1) {
                        this.chatGroups[existIndex] = new GroupModel(u.name, u.id, u.ownerId);
                    } else {
                        this.chatGroups.push(new GroupModel(u.name, u.id, u.ownerId))
                    }
                }

                if (u.type === 'F') {
                    let existIndex = this.chatUsers.findIndex(f => f.id === u.id)
                    if (existIndex !== -1) {
                        this.chatUsers[existIndex] = new UserModel(u.name, u.id, u.active);
                    } else {
                        this.chatUsers.push(new UserModel(u.name, u.id, u.active))
                    }
                }
                console.log('all is: ', this.chatUsers)

                if (u.type === 'M') {
                    console.log('me' + '---->' + data)
                    this.userInfo = new UserModel(u.name, u.id, null);
                }
                console.log('here')
                for (let user of this.chatUsers) {
                    if (!this.map.get(user.id)) {
                        this.personalService.getPersonalInformation(user.id).then(res => {
                            this.map.set(user.id, res);
                        })
                    }
                }

            })
            this.detectChange()
        }))
        this.subs.add(this.chatService.listen('message-read').subscribe((data: any) => {
            console.log('Read Message From Queueeeeee', data)
            let message: MessageModel = data;

            this.chatUsers.forEach(u => {
                if (u.id === message.fromUserId && message.toUserId === this.userInfo.id) {
                    console.log('Match User')
                    message.side = 'left'
                    u.messages.push(message)
                }
            })
            this.chatUsers.forEach(u => {
                if (u.id === this.selectedContact.id) {
                    this.mainChat = u.messages;
                    console.log('it is from user: ', this.mainChat);
                }
            })

            //TODO generate specific regex for matching on groupId or userId
            this.chatGroups.forEach(g => {
                if (g.id === message.toUserId) {
                    console.log('Match Group')
                    message.side = 'left'
                    g.messages.push(message)
                }
            })

            //TODO generate specific regex for matching on groupId or userId
            this.chatGroups.forEach(g => {
                if (g.id === this.selectedContact.id) {
                    this.mainChat = g.messages;
                    // for(let item of this.mainChat){
                    //     if(item.type == 'J'){
                    //         console.log('we are in if: ', item)
                    //         if (!this.map.get(item.fromUserId)) {
                    //             this.personalService.getPersonalInformation(item.fromUserId).then(res => {
                    //                 this.map.set(item.fromUserId, res);
                    //                 item.message = this.map.get(item.fromUserId).username + ' به گروه پیوست'
                    //             })
                    //         } else {
                    //             item.message = this.map.get(item.fromUserId).username + ' به گروه پیوست'
                    //         }
                    //     }
                    // }
                    console.log('it is from grouppppp : ', this.mainChat);
                }
            })

            if (this.mainChat && this.mainChat.length > 0) {
                this.lastAcitveId = this.mainChat[0].uuid;
            }
            console.log(this.chatUsers)
            console.log(this.chatGroups)
            this.detectChange();
        }))
        this.subs.add(this.chatService.listen('message-read-db').subscribe((data: any[]) => {
            console.log('Read Message From Database')
            console.log(data)
            //TODO Wrong approach
            if (this.selectedContact.type === 'F') {
                this.chatUsers.forEach(u => {
                    if (u.id === this.selectedContact.id) {
                        data.forEach(d => {
                            console.log('got it', d)
                            let message: MessageModel = d;
                            if (message.fromUserId == this.selectedContact.id) {
                                message.side = 'left';
                                u.messages.unshift(message)
                            } else {
                                message.side = 'right'
                                u.messages.unshift(message)
                            }
                        })
                    }
                })
            }

            if (this.selectedContact.type === 'G') {
                this.chatGroups.forEach(g => {
                    if (g.id === this.selectedContact.id) {
                        data.forEach(d => {
                            console.log('got it', d)
                            let message: MessageModel = d;
                            if (message.fromUserId == this.userInfo.id) {
                                message.side = 'left';
                                g.messages.unshift(message)
                            } else {
                                message.side = 'right'
                                g.messages.unshift(message)
                            }
                        })
                    }
                })
            }


            this.chatUsers.forEach(u => {
                if (u.id === this.selectedContact.id) {
                    this.mainChat = u.messages;
                    console.log('it is form user: ', this.mainChat);
                }
            })

            this.chatGroups.forEach(g => {
                if (g.id === this.selectedContact.id) {
                    g.messages.forEach(m =>{
                        if (!this.map.get(m.fromUserId)) {
                            this.personalService.getPersonalInformation(m.fromUserId).then(res => {
                                this.map.set(m.fromUserId, res);
                            })
                        }
                    })
                    this.mainChat = g.messages;
                    this.mainChat.map(item=>{
                        if(item.fromUserId == this.userInfo.id){
                            item.side = 'right'
                        } else {
                            item.side = 'left'
                        }
                    })
                    console.log('it is from group: ', this.mainChat);
                }
            })


            if (this.mainChat && this.mainChat.length > 0) {
                this.lastAcitveId = this.mainChat[0].uuid;
            }
            this.detectChange();
        }))
        this.subs.add(this.chatService.listen('confirmation-message').subscribe((data: any) => {
            console.log(data)
            if (data.type === 'F') {
                this.chatUsers.forEach(u => {
                    if (u.id === data.id) {
                        u.messages.forEach(m => {
                            if (m.uuid === data.temporary) {
                                m.uuid = data.confirmation
                            }
                        })
                    }
                })
                this.chatUsers.forEach(u => {
                    if (u.id === this.selectedContact.id) {
                        this.mainChat = u.messages;
                        console.log('it is: ', this.mainChat);
                        if (this.mainChat && this.mainChat.length == 1) {
                            console.log('changi it');
                            this.detectChange()
                        }
                    }
                })
            } else if (data.type === 'G') {
                this.chatGroups.forEach(u => {
                    if (u.id === data.id) {
                        u.messages.forEach(m => {
                            if (m.uuid === data.temporary) {
                                m.uuid = data.confirmation
                            }
                        })
                    }
                })
                this.chatGroups.forEach(u => {
                    if (u.id === this.selectedContact.id) {
                        this.mainChat = u.messages;
                        console.log('it is: ', this.mainChat);
                        if (this.mainChat && this.mainChat.length == 1) {
                            console.log('changi it');
                            this.detectChange()
                        }
                    }
                })
            } else {
                console.log('Baaaad')
            }

            // this.chatUsers.forEach(u => {
            //     if (u.id === data.id) {
            //         u.messages.forEach(m => {
            //             if (m.uuid === data.temporary) {
            //                 m.uuid = data.confirmation
            //             }
            //         })
            //     }
            // })
            // this.chatUsers.forEach(u => {
            //     if (u.id === this.selectedContact.id) {
            //         this.mainChat = u.messages;
            //         console.log('it is: ', this.mainChat);
            //         if(this.mainChat && this.mainChat.length ==1){
            //             console.log('changi it');
            //             this.detectChange()
            //         }
            //     }
            // })
            console.log(this.chatUsers)
        }))

        //################# NEW EVENTS #####################
        this.subs.add(this.chatService.listen('update-group-view').subscribe((data: any) => {
            //for add user to group
            if (data.type === 'A') {
                console.log("add group")
                let existIndex = this.chatGroups.findIndex(g => g.id === data.groupId)
                if (existIndex === -1) {
                    console.log("Not Found")
                    this.chatGroups.push(new GroupModel(data.name, data.groupId, data.ownerId))
                    console.log(this.chatGroups)
                    this.detectChange()
                }
            }

            //for delete user from group
            if (data.type === "D") {
                console.log("Delete Group -> NO ACTION YET!")
                console.log(data)
            }

            //when just an admin is member of there group
            //just for generate message for user with mor meaning
            if (data.type === "DD") {
                console.log("Delete Group -> WHEN ADMIN DELETE GROUPS")
            }


        }))

        this.subs.add(this.chatService.listen("general-notify").subscribe((data: any) => {
            if (data.type === GeneralNotification.GROPU_MEMBER_MORE_THAN_ONE) {
                this.toa.error('امکان حذف وجود ندارد');
            }

            if (data.type === GeneralNotification.USER_EXIST_IN_GROUP) {
                this.toa.error('کاربر در حال حاضر عضو گروه است');
            }

            if (data.type === GeneralNotification.USER_IS_NOT_MEMEBER_OG_THE_GROUP) {
                this.toa.error('کاربر عضو گروه نیست');
            }
        }))

        this.chatService.listen('message-notify').subscribe((data: any) => {

            //for join
            if (data.body.type =='J') {
                const joinUserWithId = data.header.fromUserId
                const joinGroupId = data.header.toUserId
            }

            if (data.header.other !== undefined) {
                if (data.header.other.action === 'left') {
                    const deleteType = data.body.type

                    //left by admin
                    if (deleteType === 'BA') {
                        console.log("BA")
                    }

                    //left by user itself
                    if (deleteType === 'BU') {
                        console.log("BU")
                    }
                }
            }

            console.log(data)
            if(data && data.header.senderType =='F'){
                console.log('notif comm')
                this.messageService.clear();
                this.chatService.targetUserId = data.header.fromUserId;
                this.personalService.getPersonalInformation(data.header.fromUserId).then(res => {
                    if (data.body.type === 'text') {
                        this.messageService.add(
                            {
                                severity: 'success',
                                summary: res.userName,
                                detail: data.body.message,
                                life: 4000,
                                data: {targetId: data.header.fromUserId, type:'F'}
                            })
                    } else if (data.body.type === '2') {
                        this.messageService.add(
                            {
                                severity: 'success',
                                summary: res.userName,
                                detail: 'عکس',
                                life: 4000,
                                data: {targetId: data.header.fromUserId, type:'F'}
                            })
                    } else if (data.body.type === '3') {
                        this.messageService.add(
                            {
                                severity: 'success',
                                summary: res.userName,
                                detail: 'صوت',
                                life: 4000,
                                data: {targetId: data.header.fromUserId, type:'F'}
                            })
                    } else if (data.body.type === '4') {
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
            else {
                console.log("notif comm from Group", data)
                this.chatService.targetUserId = data.header.fromUserId;
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
        })
    }

    private detectChange() {
        if (window.location.href.indexOf('communication/chat') > -1) {
            console.log('detec work')
            this.changeDetectionRef.detectChanges()
        }
    }

    showEmoji() {
        this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
    }

    setType(fileType: string) {
        this.chatFileType = fileType;
        this.showUpMenu = false;
        this.fileType = fileType;
        if (fileType === '2') {
            this.uploadFile.nativeElement.click();
        } else if (fileType === '3') {
            this.uploadFile2.nativeElement.click();
        } else if (fileType === '4') {
            this.uploadFile3.nativeElement.click();
        } else {
            this.fileType = '*'
        }
    }

    getChatFileId(event) {
        this.sendFile('4', event);
    }

    sendFile(messageType: string, content) {
        let message = new MessageModel(null, content, this.userInfo.id, this.selectedContact.id, Date.now(), messageType, uuidv4())
        this.chatService.emit('message', message);
        this.messageInputRef.nativeElement.value = '';

        this.chatUsers.forEach(u => {
            if (u.id === this.selectedContact.id) {
                message.side = 'right'
                u.messages.push(message)
            }
        })
        this.messageInputRef.nativeElement.focus();
        this.detectChange();
    }

    progress: number = 0;
    status = true;

    upload(file) {
        this.progress = 1;
        const formData = new FormData();
        formData.append('file', file);

        this.http
            .post(URL + '?path=' + 'chat', formData, {
                reportProgress: true,
                observe: 'events'
            })
            .pipe(
                map((event: any) => {
                    if (event.type == HttpEventType.UploadProgress) {
                        this.progress = Math.round((100 / event.total) * event.loaded);
                        setTimeout(() => {
                            this.detectChange()
                        }, 1000)
                    } else if (event.type == HttpEventType.Response) {
                        this.progress = null;
                        this.sendFile(this.chatFileType, event.body.message)
                    }
                }),
                catchError((err: any) => {
                    this.progress = null;
                    return throwError(err.message);
                })
            )
            .toPromise();
        this.detectChange();

    }

    setOnline() {
        if (this.status) {
            this.status = !this.status;
            this.chatService.disconnect()
        } else {
            console.log('called online')
            this.status = !this.status;
            this.ngAfterViewInit()
        }
    }

    //################# NEW EVENTS #####################
    groupName: any;
    groupLists: ChatGroupItem[] =[];
    groupInfo: any={};
    currentuserId: any;
    createGroup() {
        this.modalService.dismissAll();
        console.log("group name is: ", this.groupName)
        this.chatService.emit("create-group", {name: this.groupName, token: localStorage.getItem('JWT_TOKEN')})
    }
    
    leftFromGroup() {
        console.log("current user is: ", this.authService.getCurrentUUID())
        console.log("current group is: ", this.selectedContact.id)
        this.chatService.emit("left-group", {groupId: this.selectedContact.id,userId: this.authService.getCurrentUUID(), token: localStorage.getItem('JWT_TOKEN')})
    }


    openModal(customContent: any) {
        this.modalService.open(customContent, { windowClass: 'dark-modal', backdrop: 'static' });
    }

    goForAdd(event: Personal[]) {
        console.log("result of search: ", event[0].id)
        this.chatService.emit("join-group", {groupId: this.selectedContact.id,userId: event[0].id, token: localStorage.getItem('JWT_TOKEN')})
    }

    goForOpenModalOfDel(deleteUser: any) {
        this.chatService.getGroupUsers(this.selectedContact.id).then(res=>{
            this.groupLists = res;
        })
        this.groupLists = [];
        //calling get user of group with group id;
        this.modalService.open(deleteUser, { windowClass: 'dark-modal', size:'sm', backdrop: 'static' });
    }

    goForDeleteUserFromGroup(id: any) {
        console.log('selected id for delete: ', id)
        this.chatService.emit("left-group", {groupId: this.selectedContact.id,userId: id, token: localStorage.getItem('JWT_TOKEN')})
    }
}
