import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PasswordPatternService} from '../shared/service/PasswordPatternService';
import {UserProfile} from '../shared/dto/UserProfile';
import {PasswordPattern} from '../shared/dto/PasswordPattern';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {UserAccountService} from '../shared/service/UserAccountService';
import {nationalCodeValidator} from '../../shared/validator/nationalCode-validator';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
    selector: 'app-new-leader',
    templateUrl: './new-leader.component.html',
    styleUrls: ['./new-leader.component.scss']
})

export class NewLeaderComponent implements OnInit {

    public leaderForm: FormGroup;
    pattern: PasswordPattern;
    userProfile: UserProfile = {};
    passworderror: string;
    passworderrorLength: string;
    gender = '1';

    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
                private router: Router, private passwordPattern: PasswordPatternService,
                private userAccountService: UserAccountService, private toast: ToastrService,
    ) {

    }

    ngOnInit() {
        this.leaderForm = this.formBuilder.group({
            name: new FormControl('', [Validators.required]),
            familyName: new FormControl('', [Validators.required]),
            nationalCode: new FormControl('', [Validators.required, nationalCodeValidator]),
            username: new FormControl('', [Validators.required, Validators.minLength(3)]),
            password: new FormControl('', [Validators.required])
        });
        this.passwordPattern.getPasswordPattern().then((value: PasswordPattern) => {
            this.pattern = value;
            console.log(this.pattern);
            this.passworderror = 'پسورد باید شامل ' + this.pattern.name + ' باشد ';
            this.passworderrorLength = 'طول پسورد باید حداقل' + this.pattern.length + ' رقم باشد ';
            this.leaderForm.controls.password.setValidators([Validators.required, Validators.minLength(this.pattern.length), Validators.pattern(this.pattern.pattern)])
            this.leaderForm.controls.password.updateValueAndValidity();
        }).catch(reason => {
        })
    }

    createNewLeader() {
        this.userProfile.userRealm = 'ROLE_LEADER'
        this.userProfile.gender = JSON.parse(this.gender);
        this.userAccountService.saveUserEntity(this.userProfile).then(value => {
            let setting: SweetAlertOptions = {};
            setting.confirmButtonText = 'بستن';
            setting.title = '!ایجاد شد';
            setting.animation = true;
            setting.text = '.راهبر مورد نظر ایجاد شد';
            setting.type = 'success';
            swal.fire(
                setting
            )
            this.leaderForm.reset();
            this.router.navigate(['/user/leader-list'], {relativeTo: this.route.parent});
        }).catch(reason => {
            this.toast.error(reason.error.message);
        })
    }

}
