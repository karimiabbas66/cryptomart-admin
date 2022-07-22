import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommentList, CommentModel, CommentVoteModel, SaveCommentModel} from './comment.model';
import {CommentService} from './comment.service';
import {AuthService} from '../auth/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {PersonalService} from '../../profile/personal/personal.service';
import {FileManagerService} from '../file-manager.service';
import {Observable, Observer} from 'rxjs';
import {AppSettings} from '../../pages/shared/AppSettings';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() threadId: string = 'first';
  @Output() threadOutput: EventEmitter<any> = new EventEmitter();
  comments: CommentList[] = []
  isCollapsed: boolean = false;
  comment: SaveCommentModel ={};
  public commentForm: FormGroup;
  replyCont = '';
  openReply = new Map();
  voteMap= new Map();
  personalInfoMap = new Map();
  downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/'

  constructor(private commentService: CommentService,
              private formBuilder: FormBuilder,
              private personalService: PersonalService,
              private toast: ToastrService,
              private fileManagerService: FileManagerService,
              private authService: AuthService) { }

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      content: new FormControl('', [Validators.required]),

    });
    this.personalInfoMap.clear();
    this.voteMap.clear();
    if(this.threadId && this.threadId != 'first'){
      this.commentService.getComments(this.threadId).then(data => {
        this.comments = data;
        this.fetchVote(this.comments);
        console.log("result is: ", this.voteMap)
        this.fetchProfileAndImage(this.comments);
      })
    }
  }

  getImageFromService(uuid): Observable <any>{
    return new Observable((observer: Observer<any>)=>{
      this.fileManagerService.getImage(uuid).subscribe(data => {
        observer.next(this.createImageFromBlob(data));
      }, err => {
      })
    })
  }
  createImageFromBlob(image: Blob):any {
    return  URL.createObjectURL(image);
  }
  showInputComment(id: any) {
    if(this.openReply.get(id)){
      this.openReply.delete(id);
    } else {
      this.openReply.clear();
      this.openReply.set(id, true);
    }
  }

  submitComment(item: CommentModel) {
    let saveComment: SaveCommentModel = new SaveCommentModel();
    saveComment.content = this.replyCont;
    saveComment.threadId = item.threadId;
    saveComment.parentCommentId = item.id;
    saveComment.userProfileId = this.authService.getCurrentUUID();
    saveComment.commentThreadVisibility = true;
    saveComment.commentVisibility = true;

    if(this.replyCont != ''){
      this.commentService.submitComment(saveComment).then(data => {
        this.showInputComment(item.id);
        this.replyCont = '';
        const currentUUID = this.authService.getCurrentUUID();
        if(!this.personalInfoMap.get(currentUUID)){
          this.personalInfoMap.set(currentUUID,"name&family")
          this.personalService.getPersonalInformation(currentUUID).then(res=>{
            this.personalInfoMap.set(currentUUID, res);
          })
        }
        this.addToCommentReply(this.comments, data);
      })
    }
  }

  private addToCommentReply(commentList: CommentList[], comment: CommentModel) {
    for (let openCommentList of commentList) {
      if (openCommentList.comment.id == comment.parentId) {
        let inCommentListModel: CommentList = new CommentList();
        inCommentListModel.comment = comment;
        inCommentListModel.reply = [];
        openCommentList.reply.push(inCommentListModel);
      } else {
        if (openCommentList.reply.length > 0) {
          this.addToCommentReply(openCommentList.reply, comment);
        }
      }
    }
  }

  goForSave() {
    if(this.threadId && this.threadId != "first"){
      this.comment.threadId = this.threadId;
    }
    this.comment.username= "ADMIN-PANEL";
    this.comment.commentVisibility = true;
    this.comment.commentThreadVisibility = true;
    this.comment.userProfileId = this.authService.getCurrentUUID();
    this.commentService.submitComment(this.comment).then(res=>{
      this.threadId = res.threadId;
      this.threadOutput.emit(res.threadId);
      this.ngOnInit();

    })
  }

  voteThis(id: any, event:any) {
    let vote: CommentVoteModel={};
    vote.userProfileId = this.authService.getCurrentUUID();
    vote.commentId = id;
    vote.vote = event.newValue;
    this.commentService.voteOnComment(vote).then(res=>{
      let vote: any = {};
      vote.sumOfVote = res.vote.toFixed(2);
      vote.numberOfVote = res.numberOfVote;
      this.voteMap.set(res.id, vote);
      this.toast.info("امتیاز شما با موفقیت ثبت شد")
    }).catch(err=>{
      this.toast.error("شما قبلا به این نظز امتیاز داده اید")
    })
  }

  private fetchVote(commentsList: CommentList[]) {
    commentsList.forEach(item=>{
      let vote: any = {};
      vote.sumOfVote = item.comment.vote.toFixed(2);
      vote.numberOfVote = item.comment.numberOfVote;
      this.voteMap.set(item.comment.id, vote);
      if(item.reply && item.reply.length > 0){
        this.fetchVote(item.reply);
      }
    })
  }

  private fetchProfileAndImage(comments: CommentList[]) {
    comments.forEach(item=>{
      if(!this.personalInfoMap.get(item.comment.userProfileId)){
        this.personalInfoMap.set(item.comment.userProfileId,{});
        this.personalService.getPersonalInformation(item.comment.userProfileId).then(res=>{
          this.personalInfoMap.set(item.comment.userProfileId, res);
        })
      }
      if(item.reply.length>0){
        this.fetchProfileAndImage(item.reply);
      }
    })
  }

  resolveValueOfVote(vote: any) {
    return Math.floor(vote)
  }
}
