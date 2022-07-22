import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContentPagesRoutingModule } from "./content-pages-routing.module";

import { ComingSoonPageComponent } from "./coming-soon/coming-soon-page.component";
import { ErrorPageComponent } from "./error/error-page.component";
import { ForgotPasswordPageComponent } from "./forgot-password/forgot-password-page.component";
import { LockScreenPageComponent } from "./lock-screen/lock-screen-page.component";
import { LoginPageComponent } from "./login/login-page.component";
import { MaintenancePageComponent } from "./maintenance/maintenance-page.component";
import { RegisterPageComponent } from "./register/register-page.component";
import {NgbAlertModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {UIComponentsModule} from '../../components/ui-components.module';
import {BookDetailsComponent} from './book-details/book-details.component';
import {BookDetailsService} from './book-details/book-details.service';
import {FileUploadModule} from 'ng2-file-upload/ng2-file-upload';
import {UIComponentsRoutingModule} from '../../components/ui-components-routing.module';
import {NouisliderModule} from 'ng2-nouislider';
import {DragulaModule} from 'ng2-dragula';
import {MatchHeightModule} from '../../shared/directives/match-height.directive';
import {ImageCropperModule} from 'ng2-img-cropper';
import {TagInputModule} from 'ngx-chips';
import {HttpClientModule} from '@angular/common/http';
import {UiSwitchModule} from 'ngx-ui-switch';
import {NgSelectModule} from '@ng-select/ng-select';


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
        ComingSoonPageComponent,
        ErrorPageComponent,
        ForgotPasswordPageComponent,
        LockScreenPageComponent,
        LoginPageComponent,
        MaintenancePageComponent,
        RegisterPageComponent,
        BookDetailsComponent
    ],
    providers: [
        BookDetailsService
        ]
})
export class ContentPagesModule { }
