import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from './../_services/member.service';
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
/**
 * getMembers has parameter{pagenumber,pageSize, memberParams?}
 * unable to access the page navigate to login page.
 */
export class MemberListResolver implements Resolve<PaginatedResult<any[]>> {
  pageNumber=1;
  pageSize=5;
  constructor(private memberService:MemberService,
    private route:Router,private toastr:ToastrService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
   return this.memberService.getMembers(this.pageNumber,this.pageSize,null).
   pipe(catchError(error=>{
    this.toastr.error('Unable to access this page. Login or Register as new member');
    this.route.navigate(['/login']);
      return of(null);
   }));

  }
}
