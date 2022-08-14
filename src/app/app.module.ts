  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import {HttpClientModule } from "@angular/common/http";
  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent } from './app.component';
  import { WeatherforecastComponent } from './weatherforecast/weatherforecast/weatherforecast.component';
  import { NavComponent } from './nav/nav.component';
  import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
  import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
  import { FooterComponent } from './footer/footer/footer.component';
  import { HomeComponent } from './home/home.component';
  import { MemberLoginComponent } from './member/member-login/member-login.component';
  import { MemberRegisterComponent } from './member/member-register/member-register.component';
  import {MatButtonModule} from '@angular/material/button';
  import { MatCheckboxModule} from '@angular/material/checkbox';
  import { MatFormFieldModule} from '@angular/material/form-field';
  import { MatInputModule} from '@angular/material/input';
  import {  MatRadioModule} from '@angular/material/radio';
  import {  MatSelectModule} from '@angular/material/select';
  import {  MatCardModule} from '@angular/material/card';
  import {  MatDatepickerModule} from '@angular/material/datepicker';
  import {  MatNativeDateModule} from '@angular/material/core';
  import {  MatIconModule } from '@angular/material/icon';
import { ForgetPasswordComponent } from './member/forget-password/forget-password.component';
import { ResetPasswordComponent } from './member/reset-password/reset-password.component';
import { AboutComponent } from './about/about.component';
import { MissionStatementComponent } from './about/mission-statement/mission-statement.component';
import { PrincipalMessageComponent } from './about/principal-message/principal-message.component';
import { EducationalPolicyComponent } from './about/educational-policy/educational-policy.component';
import { JuniorSchoolComponent } from './academic/junior-school/junior-school.component';
import { SeniorSchoolComponent } from './academic/senior-school/senior-school.component';
import { CalendarComponent } from './academic/calendar/calendar.component';
import { JuniorSectionComponent } from './admission/admission-intro/junior-section/junior-section.component';
import { SeniorSectionComponent } from './admission/admission-intro/senior-section/senior-section.component';
import { LatestNewsComponent } from './latest-news/latest-news.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NotFoundComponent } from './not-found/not-found.component';


  @NgModule({
    declarations: [
      AppComponent,
      WeatherforecastComponent,
      NavComponent,
      FooterComponent,
      HomeComponent,
      MemberLoginComponent,
      MemberRegisterComponent,
      ForgetPasswordComponent,
      ResetPasswordComponent,
      AboutComponent,
      MissionStatementComponent,
      PrincipalMessageComponent,
      EducationalPolicyComponent,
      JuniorSchoolComponent,
      SeniorSchoolComponent,
      CalendarComponent,
      JuniorSectionComponent,
      SeniorSectionComponent,
      LatestNewsComponent,
      ContactUsComponent,
      NotFoundComponent
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      FontAwesomeModule,
      [MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule],
        CarouselModule.forRoot()

    ],
    exports:[
      [MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule
      ]
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule { }
