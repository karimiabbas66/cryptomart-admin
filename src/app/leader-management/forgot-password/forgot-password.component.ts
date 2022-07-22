import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PasswordPattern} from '../shared/dto/PasswordPattern';
import {nationalCodeValidator} from '../../shared/validator/nationalCode-validator';
import {UserProfile} from '../shared/dto/UserProfile';
import {PasswordPatternService} from '../shared/service/PasswordPatternService';
import {ForgotPasswordDto} from '../shared/dto/ForgotPasswordDto';
import {UserAccountService} from '../shared/service/UserAccountService';
import swal, {SweetAlertOptions} from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PersonalInformation} from '../shared/dto/PersonalInformation';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    @Input() public user: PersonalInformation;
    forgotPasswordForm: FormGroup;
    pattern: PasswordPattern;
    passworderror: string;
    passworderrorLength: string;
    forgotPassowrdDto: ForgotPasswordDto={};

    constructor(private formBuilder: FormBuilder,
                private passwordPatternService: PasswordPatternService,
                private userAccountService: UserAccountService,
                private modalService:NgbModal,
                private toast:ToastrService) {
    }

    ngOnInit() {

        this.forgotPasswordForm = this.formBuilder.group({
            password: new FormControl('', [Validators.required]),
            repeatPassword: new FormControl('', [Validators.required])
        });

        this.passwordPatternService.getPasswordPattern().then((value: PasswordPattern) => {
            this.pattern = value;
            this.passworderror = 'پسورد باید شامل ' + this.pattern.name + ' باشد ';
            this.passworderrorLength = 'طول پسورد باید حداقل' + this.pattern.length + ' رقم باشد ';
            this.forgotPasswordForm = this.formBuilder.group({
                password: new FormControl('', [Validators.required, Validators.minLength(this.pattern.length), Validators.pattern(this.pattern.pattern)]),
                repeatPassword: new FormControl('', [Validators.required])
            });
        }).catch(reason => {
            console.log(reason);
        })
    }

    submit() {
        this.forgotPassowrdDto.userId=this.user.id;
        if(this.forgotPassowrdDto.password==this.forgotPassowrdDto.repeatPassword){
            this.userAccountService.forgotPassword(this.forgotPassowrdDto).then(value => {
                this.closeModal();
                let setting: SweetAlertOptions = {};
                setting.confirmButtonText = 'بستن';
                setting.title = 'بازنشانی شد';
                setting.animation = true;
                setting.text = 'رمز عبور جدید برای کاربر مورد نظر ثبت شد';
                setting.type = 'success';
                swal.fire(
                    setting
                )
            }).catch(reason => {
                this.toast.error(reason.error.message);
            })
        }else{
            this.toast.error('رمز عبور و تکرار رمز عبور یکسان نیستند');
        }

    }

    closeModal() {
        this.modalService.dismissAll();
    }

}
