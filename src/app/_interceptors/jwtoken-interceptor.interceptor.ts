import { AuthService } from './../_services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtokenInterceptorInterceptor implements HttpInterceptor {
token:any;
  constructor(private auth:AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token= this.auth.getToken();
    if(this.token){
      const tokenizedReq = request.clone({
        headers:request.headers.set('Authorization','Bearer '+ this.token)
        // .append('Content-Type',['application/json','multipart/form-data'])
        // .append('Accept','application/json')
       // .append('Access-Control-Allow-Origin',"https://localhost:5001")
         .append('Access-Control-Allow-Headers','Content-Type')
         .append('Access-Control-Allow-Credentials','true')
      });
      return next.handle(tokenizedReq);
    }
    return next.handle(request);
  }
}
