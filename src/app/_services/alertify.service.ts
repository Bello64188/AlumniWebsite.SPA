import { Injectable } from '@angular/core';
declare  let alertify:any
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  confirm(message:string, okcallback:()=>any){
    alertify.confirm(message, function(e:any){
      if ((e)) {
    okcallback()
      }
      else{}
    });
    }
    success(message:string){
      alertify.success(message);
      }
}
