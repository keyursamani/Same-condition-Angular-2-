import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { HeaderComponent } from './header/header.component';
import { SCNotificationsRemindersService } from './services/notifications-reminders.service';
import { KeysPipe, ValuesPipe } from './pipes/keys-values.pipe';
import { WholeNumberPipe } from './pipes/whole-number.pipe';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { TotalScorePipe } from './pipes/total-score.pipe';
import { AbbrevDatePipe } from './pipes/abbrev-date.pipe';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MomentModule,
    InfiniteScrollModule,
  ],
  declarations: [
    HeaderComponent,
    KeysPipe,
    ValuesPipe,
    WholeNumberPipe,
    CustomDatePipe,
    TotalScorePipe,
    AbbrevDatePipe
  ],
  providers: [],
  exports: [
    HeaderComponent,
    KeysPipe,
    ValuesPipe,
    WholeNumberPipe,
    CustomDatePipe,
    TotalScorePipe,
    AbbrevDatePipe
  ]
})

export class CommonComponentsModule {
  static forRoot(): ModuleWithProviders {
      return {
          ngModule: CommonComponentsModule,
          providers: [
              SCNotificationsRemindersService
          ]
      };
  }
}
