import { catchError } from 'rxjs/operators';
import { AuthService } from './../_services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from 'src/app/_services/member.service';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Member } from '../_model/Member';

@Injectable({
  providedIn: 'root'
})
export class MemberEditResolver implements Resolve<Member> {
  constructor(
    private memService:MemberService,
    private toastr:ToastrService,
    private route:Router,
    private auth:AuthService
  ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.memService.getMember(this.auth.decodeToken.id)
    .pipe(catchError(error=>{
      this.toastr.error('You dont access to this area. try and login. ');
      this.route.navigate(['/members']);
      return of(null)
    }));

  }
}
