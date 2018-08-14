import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { StructureComponent } from './structure.component';
import { HeadersProvider } from '../../../common/core/headers.providers';
import { SCApi } from '../../../common/swagger-providers/sc-api.provider';
import { MomentModule } from 'angular2-moment';
import { UnauthenticatedGuard } from '../../../authguard/unauthenticated.guard';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgDatepickerModule } from 'ng2-datepicker';
import { TimelineComponent } from './timeline/timeline.component';
import { AboutComponent } from './about/about.component';
import { ConditionComponent } from './condition/condition.component';
import { TreatmentComponent } from './treatment/treatment.component';
import { SymptomsComponent } from './symptoms/symptoms.component';
import { QolserveysComponent } from './qolserveys/qolserveys.component';
import { FeelingComponent } from './feeling/feeling.component';
import { HospitilizationComponent } from './hospitilization/hospitilization.component';
import { WeightComponent } from './weight/weight.component';
import { LabtestComponent } from './labtest/labtest.component';
import { ChartComponent } from './chart/chart.component';
import { MyDatePickerModule } from 'mydatepicker';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { ResearcherComponent } from './researcher/researcher.component';
import { TooltipModule } from 'ngx-bootstrap';
import { GlobalModule } from '../global-components/global.module';

export const routes: Routes = [
  {
    path: '',
    component: StructureComponent,
    children: [
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        { path: 'profile', component: ProfileComponent },
        {
          path: 'dashboard',
          component: DashboardComponent,
          children: [
              { path: '', redirectTo: 'timeline', pathMatch: 'full' },
              { path: 'timeline', component: TimelineComponent },
              { path: 'about', component: AboutComponent },
              { path: 'condition', component: ConditionComponent },
              { path: 'treatment', component: TreatmentComponent },
              { path: 'symptoms', component: SymptomsComponent },
              { path: 'qolserveys', component: QolserveysComponent },
              { path: 'feeling', component: FeelingComponent },
              { path: 'hospitilization', component: HospitilizationComponent },
              { path: 'weight', component: WeightComponent },
              { path: 'labtest', component: LabtestComponent },
              { path: 'chart', component: ChartComponent },
              { path: 'researcher', component: ResearcherComponent },
              { path: 'physician', component: ResearcherComponent }
          ]
       },
      { path: 'notifications', component: NotificationsComponent },
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
    CommonComponentsModule,
    TooltipModule.forRoot(),
    GlobalModule  
  ],
  declarations: [
    StructureComponent,
    DashboardComponent,
    ProfileComponent,
    TimelineComponent,
    AboutComponent,
    ConditionComponent,
    TreatmentComponent,
    SymptomsComponent,
    QolserveysComponent,
    FeelingComponent,
    HospitilizationComponent,
    WeightComponent,
    LabtestComponent,
    ChartComponent,
    NotificationsComponent,
    ResearcherComponent,
  ],
   providers: [
     HeadersProvider,
     SCApi,
     UnauthenticatedGuard
  ],
})

export class StructureModule { }
