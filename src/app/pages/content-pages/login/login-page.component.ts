import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {first} from 'rxjs/internal/operators/first';
import {AuthService} from '../../../shared/auth/auth.service';
import {JwtRequest} from '../../../model/JwtRequest';
import {IpService} from '../../../shared/services/ip.service';
import {CaptchaComponent} from '../../../components/extra/captcha/captcha.component';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnInit {

    // @ts-ignore
    @ViewChild(CaptchaComponent)
    public captcha: CaptchaComponent;

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    error: string;
    claim: string;
    captchaAnswer: string;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private authenticationService: AuthService,
                private ipService: IpService,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
        });
        if (this.authenticationService.getCurrentUser()) {
            this.router.navigate(['dashboard']);
        } else {
            this.loginForm = this.formBuilder.group({
                username: new FormControl('', [Validators.required]),
                password: new FormControl('', [Validators.required])
            });
        }
    }

    get controls() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }

        let jwtReuqest = new JwtRequest();
        jwtReuqest.ipAddress = this.ipService.getIpAddress();
        jwtReuqest.username = this.controls.username.value;
        jwtReuqest.password = this.controls.password.value;
        jwtReuqest.captchaClaim=this.claim;
        jwtReuqest.captchaAnswer=this.captchaAnswer;
        jwtReuqest.realm="ROLE_LEADER";

        this.authenticationService.login(jwtReuqest).then(value => {
            this.router.navigate(['dashboard']);
        }).catch(err => {
            console.log(err)
            this.toastr.error(err.error.message);
        });
    }
    captchaInitialized(claim: string) {
        this.claim = claim;
    }

    onForgotPassword() {
        this.router.navigate(['forgotpassword'], {relativeTo: this.route.parent});
    }

}
