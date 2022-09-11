import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { MemberService } from '../_services/member.service';

@Injectable({
  providedIn: 'root'
})
export class LikeListResolver implements Resolve<boolean> {
  pageNumber=1;
  pageSize=5;
  likeParams='Likers'
  constructor(private route:Router,
    private toastr:ToastrService,private memberService:MemberService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
return this.memberService.getMembers(this.pageNumber,this.pageSize, null, this.likeParams)
.pipe(catchError(error=>{
  this.toastr.error("Problem while retrieving Member");
  this.route.navigate(['/members']);
    return of(null);
}))

  }
}
