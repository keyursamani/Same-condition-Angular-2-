

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SCApi } from './../../../common/swagger-providers/sc-api.provider';

import { NgDatepickerModule } from 'ng2-datepicker';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
export const routes: Routes = [
    { path: '', component: LoginComponent }
];

@NgModule({
  imports: [
    FormsModule,
    NgDatepickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LoginComponent,
    //ResetPasswordComponent
  ],
  providers: [
    SCApi
  ],
})
export class authenticationModule { }
