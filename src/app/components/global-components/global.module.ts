import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GlobalComponent } from './global.component';
import { HeadersProvider } from '../../../common/core/headers.providers';
import { SCApi } from '../../../common/swagger-providers/sc-api.provider';
import { MomentModule } from 'angular2-moment';
import { UnauthenticatedGuard } from '../../../authguard/unauthenticated.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgDatepickerModule } from 'ng2-datepicker';

//import { ChartModule } from 'angular2-chartjs';
import { MyDatePickerModule } from 'mydatepicker';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { FaqComponent } from './faq/faq.component';
import { UserAgreementComponent } from './user-agreement/user-agreement.component';
import { CrisisComponent } from './crisis/crisis.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { MessageComponent } from './message/message.component';
import { SettingsComponent } from './settings/settings.component';
//import { ConnectComponent} from './../module-components/connect/connect.component';
//import { ForumthreadComponent} from'./../module-components/forumthread/forumthread.component';
//import { ForumthreadreplyComponent } from './../module-components/forumthreadreply/forumthreadreply.component';
import { ConnectResearchersComponent } from './connect-researchers/connect-researchers.component';
import { CommunityConditionComponent } from './community-condition/community-condition.component';
import { CommunityConditionDetailComponent } from './community-condition-detail/community-condition-detail.component';
import { CalanderComponent } from './calander/calander.component';
import { CommunityFeedComponent } from './community-feed/community-feed.component';
import { QolchartComponent } from './qolchart/qolchart.component';
import { ConnectResearchFollowingComponent } from './connect-research-following/connect-research-following.component';
import { CommunityTreatmentComponent } from './community-treatment/community-treatment.component';
import { CommunityTreatmentDetailComponent } from './community-treatment-detail/community-treatment-detail.component';
import { CommunitySymptomsComponent } from './community-symptoms/community-symptoms.component';
import { CommunitySymptomsDetailComponent } from './community-symptoms-detail/community-symptoms-detail.component';
import { ClinicalTrialsComponent } from './clinical-trials/clinical-trials.component';
import { CharityEventsComponent } from './charity-events/charity-events.component';
import { PublicationsComponent } from './publications/publications.component';
import { ForumComponent } from './forum/forum.component';
import { ForumThreadComponent } from './forum-thread/forum-thread.component';
import { ForumThreadReplyComponent } from './forum-thread-reply/forum-thread-reply.component';

export const routes: Routes = [
  {
    path: '',
    component: GlobalComponent,
    children: [
        { path: '', redirectTo: 'publications', pathMatch: 'full' },
        { path: 'publications', component: PublicationsComponent },
        { path: 'faq', component: FaqComponent },
        { path: 'user-agreement', component: UserAgreementComponent },
        { path: 'crisis', component: CrisisComponent },
        { path: 'advertisement', component: AdvertisementComponent },
        { path: 'message', component: MessageComponent },
        { path: 'settings', component: SettingsComponent },
        { path: 'connect', component: ConnectResearchersComponent },
        //{ path: 'connect/:id', component: ForumthreadComponent },
        //{ path: 'connect/forumThreadReply/:id', component: ForumthreadreplyComponent },
        //{ path: 'connect', component: ConnectResearchersComponent },
        { path: 'ConnectResearchers/ConnectResearchFollowing', component: ConnectResearchFollowingComponent },
        { path: 'community-condition', component: CommunityConditionComponent },
        { path: 'community-condition-detail/:id', component: CommunityConditionDetailComponent },
        { path: 'community-feed', component: CommunityFeedComponent },
        { path: 'community-symptoms', component: CommunitySymptomsComponent },
        { path: 'community-treatment', component: CommunityTreatmentComponent },
        { path: 'community-treatment-detail/:tid/:tname', component: CommunityTreatmentDetailComponent },
        { path: 'community-symptoms', component: CommunitySymptomsComponent },
        { path: 'community-symptoms-detail', component: CommunitySymptomsDetailComponent },
        { path: 'clinical-trials', component: ClinicalTrialsComponent },
        { path: 'charity-events', component: CharityEventsComponent },
        { path: 'forum', component: ForumComponent },
        { path: 'forum-thread/:id', component: ForumThreadComponent },
        { path: 'forum-thread-reply/:id', component: ForumThreadReplyComponent },
    ]
  },
];



@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MomentModule,
    NgDatepickerModule,
    MyDatePickerModule,
    InfiniteScrollModule,
    RouterModule.forChild(routes),
    NgbModule.forRoot(),
    CommonComponentsModule
  ],
  declarations: [
    GlobalComponent,
    FaqComponent,
    UserAgreementComponent,
    CrisisComponent,
    AdvertisementComponent,
    MessageComponent,
    SettingsComponent,
    //ConnectComponent,
    //ForumthreadComponent,
    //ForumthreadreplyComponent,
    ConnectResearchersComponent,
    CommunityConditionComponent,
    CommunityConditionDetailComponent,
    CalanderComponent,
    CommunityFeedComponent,
    QolchartComponent,
    ConnectResearchFollowingComponent,
    CommunitySymptomsComponent,
    CommunityTreatmentComponent,
    CommunityTreatmentDetailComponent,
    CommunitySymptomsDetailComponent,
    ClinicalTrialsComponent,
    CharityEventsComponent,
    PublicationsComponent,
    ForumComponent,
    ForumThreadComponent,
    ForumThreadReplyComponent
  ],
   providers: [
     HeadersProvider,
     SCApi,
     UnauthenticatedGuard
  ],
  exports:[
    CalanderComponent,
    QolchartComponent
    ]
})

export class GlobalModule { }
