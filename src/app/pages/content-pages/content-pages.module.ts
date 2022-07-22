import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {ContentPagesRoutingModule} from './content-pages-routing.module';
import {ErrorPageComponent} from './error/error-page.component';
import {LoginPageComponent} from './login/login-page.component';
import {RegisterPageComponent} from './register/register-page.component';
import {NgbAlertModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {UIComponentsModule} from '../../components/ui-components.module';
import {BookDetailsComponent} from './book-details/book-details.component';
import {BookDetailsService} from './book-details/book-details.service';
import {FileUploadModule} from 'ng2-file-upload/ng2-file-upload';


@NgModule({
    imports: [
        CommonModule,
        ContentPagesRoutingModule,
        ReactiveFormsModule,
        NgbAlertModule,
        UIComponentsModule,
        NgbModule,
        FileUploadModule
    ],
    declarations: [
        ErrorPageComponent,
        LoginPageComponent,
        RegisterPageComponent,
        BookDetailsComponent
    ],
    providers: [
        BookDetailsService
    ]
})
export class ContentPagesModule {
}
