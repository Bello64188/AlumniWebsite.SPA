import { catchError } from 'rxjs/operators';
import { Member } from './../_model/Member';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, map ,retry} from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public jwtHelperService:JwtHelperService = new JwtHelperService()
  decodeToken:any
  currentUser:any
  BaseUrl= environment.AccountUrl;
  constructor(private http:HttpClient) { }
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
        localStorage.setItem('token',member.token);
        localStorage.setItem('memberFromDto',JSON.stringify(member.memberFromDto));
        this.decodeToken = this.jwtHelperService.decodeToken(member.token);
        console.log(this.decodeToken);
        this.currentUser= member.memberFromDto;
      }
    })
    );
  }
  //* member register
  Register(member:Member){
    return this.http.post(this.BaseUrl + 'register',member).
    pipe(retry(2));
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
}



