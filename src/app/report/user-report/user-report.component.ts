import {Component, OnInit} from '@angular/core';
import {ProfileSearchDto} from '../../leader-management/shared/dto/ProfileSearchDto';
import {Personal} from '../../profile/shared/dto/Personal';
import {AppSettings} from '../../pages/shared/AppSettings';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {UserAccountService} from '../../leader-management/shared/service/UserAccountService';
import {EnableDto} from '../../leader-management/shared/dto/EnableDto';
import {ProfileListService} from '../../profile/profile-list/profile-list.service';

@Component({
    selector: 'app-user-report',
    templateUrl: './user-report.component.html',
    styleUrls: ['./user-report.component.scss']
})
export class UserReportComponent implements OnInit {

    showSearchPanel = false;
    profileSearchDto: ProfileSearchDto[] = [];
    cancelEnabled: boolean = false;
    searchEnabled: boolean = false;
    public showProgress: boolean = false;
    firstPanel: [] = [];
    profileCount: number;
    private pageSize = 9;
    totalRecords;
    profiles: Personal[];
    downloadUrl = AppSettings.UPLOAD_API_ENDPOINT + 'api/download/'

    constructor(private toastr: ToastrService,
                private personalInfoService: UserAccountService,
                private profileListService: ProfileListService) {
    }

    ngOnInit() {
        this.showProgress = true;
        this.profileCount = 10;
        this.profiles = [{
            firstName: 'ahmad',
            lastName: 'ahmadi',
            nationalCode: '0018380451',
            userName: 'ahmadahmadi',
            mainPhone: '09126854715',
            gender: false,
            isEnable: true
        },
            {
                firstName: 'mohamad',
                lastName: 'mohamadi',
                nationalCode: '0018347451',
                userName: 'mohamadahmadi',
                mainPhone: '09134854715',
                gender: false,
                isEnable: true
            },
            {
                firstName: 'meysam',
                lastName: 'meysami',
                nationalCode: '0018380451',
                userName: 'meysamahmadi',
                mainPhone: '09126145715',
                gender: false,
                isEnable: true
            },
            {
                firstName: 'hamid',
                lastName: 'hamidi',
                nationalCode: '0018380451',
                userName: 'hamidahmadi',
                mainPhone: '09126854715',
                gender: false,
                isEnable: true
            },
            {
                firstName: 'ahmad',
                lastName: 'hamidi',
                nationalCode: '0018380451',
                userName: 'ahmadhamidi',
                mainPhone: '09112554715',
                gender: false,
                isEnable: true
            },
            {
                firstName: 'abbas',
                lastName: 'abbasi',
                nationalCode: '0018380451',
                userName: 'ahmadabbasi',
                mainPhone: '09126847415',
                gender: false,
                isEnable: true
            },
            {
                firstName: 'abbas',
                lastName: 'ahmadi',
                nationalCode: '0018380451',
                userName: 'abbasahmadi',
                mainPhone: '09126222215',
                gender: false,
                isEnable: true
            },
            {
                firstName: 'saeed',
                lastName: 'ahmadi',
                nationalCode: '0018380451',
                userName: 'saeedahmadi',
                mainPhone: '09126853515',
                gender: false,
                isEnable: true
            },
            {
                firstName: 'morteza',
                lastName: 'ahmadi',
                nationalCode: '0018380451',
                userName: 'mortezaahmadi',
                mainPhone: '09126878415',
                gender: false,
                isEnable: true
            }]
        this.showProgress = false;
    }

    setEnable(event, id) {
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

    onRefreshTable() {
        this.cancelEnabled = false;
        this.firstPanel = [];
        this.showSearchPanel = !this.showSearchPanel;
        this.ngOnInit()
    }

    onSearchItems() {
        this.showProgress = true;
        this.profileListService.countAllByItems(this.profileSearchDto).then(res => {
            this.profileCount = res;
            if (this.profileCount == 0) {
                this.toastr.info('نتیجه ای یافت نشد!')
            } else {
                this.profileListService.searchAllProfiles(this.profileSearchDto, 0, this.pageSize).then(res => {
                    this.profiles = res;
                    this.showProgress = false;
                })
            }
        })
    }

    loadProfiles(pageNumber: number) {
        this.showProgress = true;
        this.profileListService.getProfiles(pageNumber - 1, this.pageSize).then(value => {
            this.profiles = value;
            this.showProgress = false;
        }).catch(err => {
            this.toastr.error(err.error.message)
            this.showProgress = false;
            this.showProgress = false;
        });
    }

    disableSearchButton() {
        this.searchEnabled = false;
        return false;
    }

    printPdf(): void {
    }

    printXlc(): void {
    }


}
