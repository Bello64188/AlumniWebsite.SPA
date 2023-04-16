import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Member } from './../_model/Member';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, map ,retry,BehaviorSubject,ReplaySubject} from "rxjs";
import { environment } from 'src/environments/environment';
import { ResetPasswordDto } from '../member/reset-password/reset-password.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public jwtHelperService:JwtHelperService = new JwtHelperService()
  decodeToken:any;
  currentUser:any
  private currentUserSource= new ReplaySubject<Member>(1,60000);
  currentMember$= this.currentUserSource.asObservable();
  private photoUrl = new BehaviorSubject<string>('../../assets/images/graduateImg.jpg');
  currentPhotoUrl = this.photoUrl.asObservable();
  BaseUrl= environment.AccountUrl;
  constructor(private http:HttpClient, private route:Router,
    private toastr: ToastrService) { }
 //* member login
 /**
  * set jwt token
  * set memberFromDto and convert it into JSON string
  * decode the token in other to get the claims
  * set data for the memberFromDto to particular user that login.
  * @param model
  * @returns http
  */
  login(model:Member){
    return this.http.post(this.BaseUrl + 'login',model)
    .pipe(map((response:any)=>{
      const member = response;
      if(member){
        this.setCurrentMember(member);
        localStorage.setItem('token',member.token);
        localStorage.setItem('memberFromDto',JSON.stringify(member.memberFromDto));
        this.decodeToken = this.jwtHelperService.decodeToken(member.token);
        this.currentUser= member.memberFromDto;
        this.currentUserSource= member.memberFromDto;
        if(this.currentUser.photoUrl !== null)
        this.changeMemberPhoto(this.currentUser.photoUrl);
        else
        this.changeMemberPhoto('../../assets/images/graduateImg.jpg');
      }
    })
    );
  }
  //* method that emmit behaviorSubject and last return last emmit date
  //* to the subscriber
  changeMemberPhoto(photoUrl:string){
  this.photoUrl.next(photoUrl);
  }
  //* member register
  Register(member:Member){
    return this.http.post(this.BaseUrl + 'register',member).
    pipe(retry(2));
  }
  ForgetPassword(model:ForgetPassword){
    return this.http.post(this.BaseUrl+'forgetPassword',model);
  }
  ResetPassword(model:ResetPasswordDto){
    return this.http.post(this.BaseUrl+ 'resetPassword',model);
  }
  getToken(){ //? getting token from local storage
    let token = localStorage.getItem('token');
    return token;
  }

  isMemberAuth(){
    const token :string |null =localStorage.getItem('token');
    if(token && !this.jwtHelperService.isTokenExpired(token))
    return true;
    return token;
  }

  logout(){
  this.decodeToken=null;
  this.currentUser=null;
  localStorage.removeItem('token');
  localStorage.removeItem('memberFromDto');
  this.toastr.success("Logged out successfully...");
  this.route.navigate(['/home']);
}
getActiveUser(){
  return this.jwtHelperService.decodeToken(this.jwtHelperService.tokenGetter());
}
setCurrentMember(member:Member){
member.roles=[];
const roles= this.getDecodeToken(member.token).role;
Array.isArray(roles)?member.roles=roles:member.roles.push(roles);
this.currentUserSource.next(member);
console.log(this.currentUserSource);
}
getDecodeToken(token:any){
return JSON.parse(atob(token.split('.')[1]));
}
}
export class ForgetPassword{
  email:string
  clientUrl:string
}


