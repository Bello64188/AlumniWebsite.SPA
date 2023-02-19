import { Message } from 'src/app/_model/Message';
import { catchError } from 'rxjs/operators';
import { MemberService } from './../_services/member.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { PaginatedResult } from '../_model/Pagination';

@Injectable({
  providedIn: 'root'
})
export class MessageResolver implements Resolve<PaginatedResult<Message[]>> {
  messageContainer ='unread';
  pageNumber= 1;
  pageSize =5;
  constructor(
    private auth:AuthService,
    private toastr:ToastrService,
    private route:Router,
    private memberService:MemberService
  ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PaginatedResult<Message[]>> {
    return this.memberService.getMessages(this.auth.decodeToken.id,this.pageNumber,this.pageSize,this.messageContainer)
    .pipe(catchError(error=>{
      this.toastr.error("there is a problem while retrieving messages");
      this.route.navigate(['/members']);
      return of(null as any);
    }));
  }
}
