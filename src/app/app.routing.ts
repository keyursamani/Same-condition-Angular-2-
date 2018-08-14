import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { UnauthenticatedGuard } from './../authguard/unauthenticated.guard';
import { ResetPasswordComponent } from './components/authentication-component/reset-password/reset-password.component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadChildren: './components/authentication-component/authentication.module#authenticationModule' },
    { path: 'reset-password', component: ResetPasswordComponent},
    { path: 'global', loadChildren: './components/global-components/global.module#GlobalModule' },
    { path: 'app', canActivate:[UnauthenticatedGuard], loadChildren: './components/module-components/structure.module#StructureModule' },
    
    { path: '**', redirectTo: '' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });

