  import { Injectable } from '@angular/core';
  import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
  } from '@angular/common/http';
  import { Observable , throwError } from 'rxjs';
  import { Router } from '@angular/router';
  import { ToastrService } from 'ngx-toastr';
  import { catchError } from "rxjs/operators";

  @Injectable()
  export class ErrorInterceptorInterceptor implements HttpInterceptor {

  constructor( private route:Router, private toastr:ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(
      catchError((error:any)=>{
      if(error){
        switch(error.status){
            case 400: //? return message if error status code is 400

              if(error.error.errors){
              const modalStateError=[];
              for(const key in error.error.errors){
              if(error.error.errors[key]){
              modalStateError.push(error.error.errors);
              }
              }
              throw modalStateError.flat();
              }else if(typeof(error.error)==='object'){
              this.toastr.error(error.statusText,(error.status).toString());
              }else{
              this.toastr.error(error.error,(error.status).toString());
              }
              break;
            case 401: //? return message if error status code is 401
              this.toastr.error('Unauthorized', (error.status).toString());

              break;
            case 404://? redirect to not-found page
              this.route.navigate(['/not-found']);
              break;
            case 500://? redirect to not-found page
              this.route.navigate(['/not-found']);
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(error);
              break;
            }
            }
              return throwError(error);
            })
    )

  }
}
