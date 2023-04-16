import { AuthGuard } from './_guard/auth.guard';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { MessageResolver } from './_resolver/message.resolver';
import { LikeListResolver } from './_resolver/like-list.resolver';
import { MemberLikeListComponent } from './member/member-like-list/member-like-list.component';
import { PreventUnsavedDataGuard } from './_guard/prevent-unsaved-data.guard';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { MemberDetailsResolver } from './_resolver/member-details.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { MemberCardComponent } from './member/member-card/member-card.component';
import { MemberDetailsComponent } from './member/member-details/member-details.component';
import { MemberEditComponent } from './member/member-edit/member-edit.component';
import { MemberMessagesComponent } from './member/member-messages/member-messages.component';
import { MemberListComponent } from './member/member-list/member-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LatestNewsComponent } from './latest-news/latest-news.component';
import { SeniorSectionComponent } from './admission/admission-intro/senior-section/senior-section.component';
import { JuniorSectionComponent } from './admission/admission-intro/junior-section/junior-section.component';
import { CalendarComponent } from './academic/calendar/calendar.component';
import { SeniorSchoolComponent } from './academic/senior-school/senior-school.component';
import { JuniorSchoolComponent } from './academic/junior-school/junior-school.component';
import { EducationalPolicyComponent } from './about/educational-policy/educational-policy.component';
import { PrincipalMessageComponent } from './about/principal-message/principal-message.component';
import { MissionStatementComponent } from './about/mission-statement/mission-statement.component';
import { AboutComponent } from './about/about.component';
import { ResetPasswordComponent } from './member/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './member/forget-password/forget-password.component';
import { MemberRegisterComponent } from './member/member-register/member-register.component';
import { MemberLoginComponent } from './member/member-login/member-login.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './_guard/admin.guard';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'',
   runGuardsAndResolvers:'always',
    canActivate:[AuthGuard],
  children:[
    {path:'member-card',component:MemberCardComponent}, //? remove later.
    {path: 'members', component:MemberListComponent,resolve:{members:MemberListResolver}},//?resolver
    {path: 'member-details', component:MemberDetailsComponent},//?resolver
    {path:'member/edit',component:MemberEditComponent,resolve:{member:MemberEditResolver},
                      canDeactivate:[PreventUnsavedDataGuard]},//?canDeactivate and Resolver
    {path:'messages',component:MemberMessagesComponent,resolve:{messages:MessageResolver}},
    {path:'like-list', component:MemberLikeListComponent,resolve:{members:LikeListResolver}},
    {path:'members/:id',component: MemberDetailsComponent, resolve:{members:MemberDetailsResolver}},//?resolver
    {path:'admin',component:AdminDashboardComponent , canActivate:[AdminGuard]}
  ]},
  {path:'home',component:HomeComponent},
  {path:'login',component:MemberLoginComponent},
  {path:'register', component:MemberRegisterComponent},
  {path:'forget-password', component:ForgetPasswordComponent},
  {path:'reset-password', component:ResetPasswordComponent},
  {path:'about', component:AboutComponent},
  {path: 'mission-statement', component:MissionStatementComponent},
  {path: 'principal-message', component:PrincipalMessageComponent},
  {path: 'educational-policy', component:EducationalPolicyComponent},
  {path: 'junior-school', component:JuniorSchoolComponent},
  {path: 'senior-school', component:SeniorSchoolComponent},
  {path: 'calendar', component:CalendarComponent},
  {path: 'junior-section', component:JuniorSectionComponent},
  {path:'senior-section', component:SeniorSectionComponent},
  {path: 'latest-news', component:LatestNewsComponent},
  {path: 'contact-us',component:ContactUsComponent},
  {path: 'not-found',component:NotFoundComponent},
  {path: '**',component:NotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})

export class AppRoutingModule {

}
