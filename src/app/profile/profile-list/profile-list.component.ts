import {Component, OnInit} from '@angular/core';
import {ProfileListService} from './profile-list.service';
import {ToastrService} from 'ngx-toastr';
import {Personal} from '../shared/dto/Personal';
import {FileManagerService} from '../../shared/file-manager.service';
import {Observable, Observer} from 'rxjs';
import {EnableDto} from '../../leader-management/shared/dto/EnableDto';
import {UserAccountService} from '../../leader-management/shared/service/UserAccountService';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {AppSettings} from '../../pages/shared/AppSettings';
import {PersonalInformation} from '../../leader-management/shared/dto/PersonalInformation';
import {ProfileSearchDto} from '../../leader-management/shared/dto/ProfileSearchDto';

@Component({
    selector: 'app-profile-list',
    templateUrl: './profile-list.component.html',
    styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent implements OnInit {

    totalRecords;
    profiles: Personal[]
    items: PersonalInformation[];
    profileCount: number;
    photoImage: any;
    pagesize = 5;
    firstPanel: [] = [];
    profileSearchDto: ProfileSearchDto[] = [];
    public showProgress: boolean=false;
    private pageSize=9;
    downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/'
    searchEnabled: boolean = false;
    cancelEnabled: boolean = false;
    showSearchPanel= false;

    constructor(private profileListService: ProfileListService,
                private fileManagerService: FileManagerService,
                private personalInfoService: UserAccountService,
                private toastr: ToastrService,) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.profileListService.getProfiles(0, this.pageSize).then(data => {
            this.profileListService.getProfileCount().then(result => {
                this.profileCount = result;
            })
            this.profiles = data;
            this.showProgress =false;
        }).catch(err=>{
            this.toastr.error(err.error.message)
            this.showProgress = false;
        })
    }


    removeProfile(profileId: number) {
        this.profileListService.removeProfile(profileId).then(result => {
            this.profileListService.getProfiles().then(data => {
                this.profiles = data;
                this.toastr.success("پروفایل با موفقیت حذف شد");
            })
        });
    }

    setEnable(event,id) {
        var text = 'فعال شد';
        if (!event) {
            text = 'غیرفعال شد'
        }
        var enableDto = new EnableDto();
        enableDto.id = id;
        enableDto.isEnable = event;
        this.personalInfoService.updateActivity(enableDto).then(value => {

            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = text;
            setting.animation = true;
            setting.text = 'وضعیت حساب مورد نظر تغییر کرد';
            setting.type = 'success';
            swal.fire(
                setting
            )
        }).catch(reason => {
            this.toastr.error(reason.error.message)
        });
    }

    test(key, value) {
        console.log(key, value)
        var profile = this.profileSearchDto.filter(value => value.key == key);
        console.log(this.profileSearchDto)
        if (profile.length > 0) {
            profile[0].value = value;
        } else {
            this.profileSearchDto.push({key: key, value: value})
        }
    }

    disableSearchButton() {
        this.searchEnabled = false;
        return false;
    }

    onSearchItems() {
        this.showProgress = true;
        this.profileListService.countAllByItems(this.profileSearchDto).then(res => {
            this.profileCount = res;
            if(this.profileCount == 0){
                this.toastr.info("نتیجه ای یافت نشد!")
            }else {
                this.profileListService.searchAllProfiles(this.profileSearchDto, 0, this.pageSize).then(res => {
                    this.profiles = res;
                    this.showProgress = false;
                })
            }
        })
    }

    onRefreshTable() {
        this.cancelEnabled = false;
        this.firstPanel = [];
        this.showSearchPanel = !this.showSearchPanel;
        this.ngOnInit()
    }

    loadProfiles(pageNumber: number) {
        this.showProgress=true;
        this.profileListService.getProfiles(pageNumber - 1, this.pageSize).then(value => {
            this.profiles = value;
            this.showProgress=false;
        }).catch(err=>{
            this.toastr.error(err.error.message)
            this.showProgress=false;
            this.showProgress = false;
        });
    }

    setCreateDate(event: any) {
        console.log("event",event);
        console.log("dto",this.profileSearchDto);
    }
}
