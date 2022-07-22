import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ErrorPageComponent} from './error/error-page.component';
import {LoginPageComponent} from './login/login-page.component';
import {RegisterPageComponent} from './register/register-page.component';
import {BookDetailsComponent} from './book-details/book-details.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'error',
                component: ErrorPageComponent,
                data: {
                    title: 'Error Page'
                }
            },
            {
                path: 'login',
                component: LoginPageComponent,
                data: {
                    title: 'Login Page'
                }
            },
            {
                path: 'register',
                component: RegisterPageComponent,
                data: {
                    title: 'Register Page'
                }
            }
            ,
            {
                path: 'book-details',
                component: BookDetailsComponent,
                data: {
                    title: 'Register Page'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ContentPagesRoutingModule {
}
