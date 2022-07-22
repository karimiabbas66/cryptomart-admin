import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CaptchaService} from './captcha.service';

@Component({
    selector: 'app-captcha',
    templateUrl: './captcha.component.html',
    styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit {

    private BASE64_DATA_URI_PREFIX = 'data:image/png;base64,';
    captchaData: string;

    @Output() initialized: EventEmitter<string> = new EventEmitter<string>();

    constructor( private captchaService: CaptchaService) {
    }

    ngOnInit() {
        this.generateCaptcha();
    }

    refresh() {
        this.generateCaptcha();
    }

    private generateCaptcha() {
        this.captchaService.generateCaptcha().then(res=> {
            this.captchaData = this.BASE64_DATA_URI_PREFIX + res.body;
            this.initialized.emit(res.headers.get('mycaptcha'));
        }).catch(error => {
            console.log('error')
        })
    }

    captchaRefresh() {
        this.generateCaptcha();
    }

}
