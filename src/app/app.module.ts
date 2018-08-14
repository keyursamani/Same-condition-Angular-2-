import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Router,NavigationStart, NavigationEnd, RouterModule } from '@angular/router';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { ProfileComponent } from './components/module-components/profile/profile.component';
import { UnauthenticatedGuard } from './../authguard/unauthenticated.guard';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageModule } from 'angular-2-local-storage';
import { SimpleNotificationsModule } from 'angular2-notifications-lite';
import { PushNotificationsService } from 'angular2-notifications-lite';
import { NotificationsService} from 'angular2-notifications-lite';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MomentModule } from 'angular2-moment';

import { CommonComponentsModule } from './components/common-components/common-components.module';
import { BlockUIModule } from 'ng-block-ui';
import { ResetPasswordComponent } from './components/authentication-component/reset-password/reset-password.component';

export function initFactory(){

}

@NgModule({
    declarations: [
        AppComponent,
        ResetPasswordComponent
        // CalanderComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule,
        BrowserAnimationsModule,
        routing,
        MomentModule,
        NgbModule.forRoot(),
        LocalStorageModule,
        SimpleNotificationsModule.forRoot(),
        CommonComponentsModule.forRoot(),
        BlockUIModule,
        //CalendarModule.forRoot()
    ],
    providers: [
      PushNotificationsService,
      UnauthenticatedGuard
    ],
    bootstrap: [ AppComponent ]
    // exports : [CalanderComponent]
})


export class AppModule {

  constructor(private router: Router) {
    router.events.subscribe((event) => {
    });
  }
}

