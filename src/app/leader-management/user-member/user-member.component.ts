import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PersonalInformation} from '../shared/dto/PersonalInformation';
import {UserAccountService} from '../shared/service/UserAccountService';
import {UserEntityService} from '../shared/service/UserEntityService';
import {UserMember} from '../shared/dto/UserMember';
import {UserMemberEntityDto} from '../shared/dto/UserMemberEntityDto';
import {UserMemberSerivce} from '../shared/service/UserMemberSerivce';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-user-member',
    templateUrl: './user-member.component.html',
    styleUrls: ['./user-member.component.scss']
})
export class UserMemberComponent implements OnInit {

    @ViewChild('UserMemberPage', {static: false}) public userMemberPage: NgbPagination;
    @ViewChild('NotUserMemberPage', {static: false}) public notUserMemberPage: NgbPagination;
    @Input() public userEntityId: number
    userMemberstotalRecords: number = 0;
    notmemberstotalRecords: number = 0;
    userMembers: UserMember[] = [];
    userMembersItems: UserMember[] = [];
    notmembers: UserMember[] = [];
    notmembersItems: UserMember[] = [];
    showProgress: boolean;
    pagesize = 5;
    userMemberEntityDto: UserMemberEntityDto = {};

    constructor(private userEntityService: UserEntityService,
                private userMemberService: UserMemberSerivce) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.userMemberEntityDto.userEntityId = this.userEntityId;
        this.userEntityService.findMembersByUserEntityId(this.userEntityId, 0, this.pagesize).then(value => {
            this.userMembers = value;
            this.showProgress = false;
            this.userMemberstotalRecords = this.userMembers.length;
            this.getUserMembersItems(1, 5);
            this.userMemberService.findOtherUserMemberByEntityId(this.userEntityId).then(value1 => {
                this.notmembers = value1;
                this.notmemberstotalRecords = this.notmembers.length;
                this.getNotMembersItems(1, 5);
            })
        }).catch(reason => {
            console.log(reason);
        })
    }

    deleteUserMember(userId) {
        swal.fire({
            title: 'آیا از حذف کابر از گروه مورد نظر اطمینان دارید؟',
            type: 'warning',
            showCancelButton: true,
            animation: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'انصراف',
            confirmButtonText: '!بله, حذف کن'
        }).then((result) => {
            console.log(this.userMemberEntityDto)
            this.userMemberEntityDto.userMemberEntityId = userId;
            this.userMemberService.deleteUserMemberEntity(this.userMemberEntityDto).then(value => {
                var x = this.userMembers.filter(value1 => value1.userAccountId == userId);
                console.log(x)
                var idx = this.userMembers.indexOf(x[0]);
                var idx2=this.userMembersItems.indexOf(x[0]);
                console.log(idx)
                this.notmembers.push(x[0]);
                this.notmembersItems.push(x[0]);
                this.userMembers.splice(idx, 1);
                this.userMembersItems.splice(idx2, 1);
                this.userMemberstotalRecords--;
                this.notmemberstotalRecords++;
                this.getNotMembersItems(this.notUserMemberPage.page,this.pagesize);
                this.getUserMembersItems(this.userMemberPage.page,this.pagesize);
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = '!حدف شد';
                setting.animation = true;
                setting.text = '.کاربر مورد نظر حذف شد';
                setting.type = 'success';
                swal.fire(
                    setting
                )
            }).catch(reason => {

            })
        })
    }

    addUserMember(userId) {
        this.userMemberEntityDto.userMemberEntityId = userId;
        this.userMemberService.addUserMemberEntity(this.userMemberEntityDto).then(value => {
            var x = this.notmembers.filter(value1 => value1.userAccountId == userId);
            var idx = this.notmembers.indexOf(x[0]);
            var idx2=this.notmembersItems.indexOf(x[0]);
            this.userMembers.push(x[0]);
            this.userMembersItems.push(x[0]);
            this.notmembers.splice(idx, 1);
            this.notmembersItems.splice(idx2, 1);
            this.userMemberstotalRecords++;
            this.notmemberstotalRecords--;
            this.getNotMembersItems(this.notUserMemberPage.page,this.pagesize);
            this.getUserMembersItems(this.userMemberPage.page,this.pagesize);
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = '!اضافه شد';
            setting.animation = true;
            setting.text = '.کاربر مورد نظر اضافه شد';
            setting.type = 'success';
            swal.fire(
                setting
            )
        }).catch(reason => {

        })
    }

    getUserMembersItems(pageNumber, size) {
        var length = pageNumber * size > this.userMemberstotalRecords ? this.userMemberstotalRecords : pageNumber * size;
        this.userMembersItems = [];
        for (let i = (pageNumber - 1) * size; i < length; i++) {
            this.userMembersItems.push(this.userMembers[i]);
        }
    }

    getNotMembersItems(pageNumber, size) {
        var length = pageNumber * size > this.notmemberstotalRecords ? this.notmemberstotalRecords : pageNumber * size;
        this.notmembersItems = [];
        for (let i = (pageNumber - 1) * size; i < length; i++) {
            this.notmembersItems.push(this.notmembers[i]);
        }
    }


}
