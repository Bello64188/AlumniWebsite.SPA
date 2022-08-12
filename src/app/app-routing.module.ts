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

const routes: Routes = [
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
  {path: 'calendar', component:CalendarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})

export class AppRoutingModule {

}
