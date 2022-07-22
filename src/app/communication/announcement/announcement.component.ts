import { Component, OnInit } from '@angular/core';
import {AnnouncementModel} from '../shared/dto/announcement.model';
import {Personal} from '../../profile/shared/dto/Personal';
import {AnnouncementService} from '../shared/service/announcement.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  announcement: AnnouncementModel = {};
  alarmType: number;
  targetIds: string[] = [];

  constructor(private announcementService: AnnouncementService,
              private toastr: MessageService) { }

  ngOnInit() {
  }

  onSend() {
    this.announcement.isRead = false;
    console.log(this.announcement)
    this.announcementService.sendSingleAnnouncement(this.announcement).then(res =>{
      this.toastr.add({severity:'success', summary:'موفق', detail:'ثبت شد'});
    }).catch(reason => {
      this.toastr.add({severity:'error', summary:'نا موفق', detail:'ثبت اعلان با خطا مواجه شد'});
    })
  }

  sendToAllUsers() {
    this.announcement.isRead = false;
    console.log(this.announcement)
    this.announcementService.sendToAllUsers(this.announcement).then(res =>{
      this.toastr.add({severity:'success', summary:'موفق', detail:'ثبت شد'});
    }).catch(reason => {
      this.toastr.add({severity:'error', summary:'نا موفق', detail:'ثبت اعلان با خطا مواجه شد'});
    })
  }

  setTargetId(event: Personal[]) {
    if(event[0]){
      this.targetIds.push(event[0].id);
      this.announcement.targetUserIds = this.targetIds;
      console.log(this.announcement);
    }
  }

  changeAlarmType(value) {
    this.alarmType = value;
    this.announcement.alarmType = this.alarmType;
  }
}
