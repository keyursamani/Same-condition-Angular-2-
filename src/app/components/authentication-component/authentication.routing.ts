

import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { UnauthenticatedGuard } from './../../../authguard/unauthenticated.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    //{ path: 'reset-password', component: ResetPasswordComponent }
];
