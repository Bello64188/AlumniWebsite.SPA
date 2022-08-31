import { catchError } from 'rxjs/operators';
import { Member } from './../_model/Member';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../_services/auth.service';
import { MemberService } from 'src/app/_services/member.service';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailsResolver implements Resolve<Member> {
 constructor(private memService:MemberService,private router:Router,
  private auth:AuthService,private toastr:ToastrService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.auth.getActiveUser();
    return this.memService.getMember(route.params['id']).
    pipe(catchError(error=>{
      this.toastr.error("Unable to show member details please try and login.");
      this.router.navigate(['/members']);
      return of(null);
    }));

  }
}
