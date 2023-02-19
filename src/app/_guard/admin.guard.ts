import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable,map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService:AuthService, private toastr:ToastrService, private router:Router){}
  canActivate(): Observable<any>{
   return this.authService.currentMember$.pipe(map(user=>{
    if(user.roles?.includes('Admin')||user.roles?.includes('Moderator')){
      return true;
    }
    this.toastr.error("You cannot access this page");
    this.router.navigate(['/home']);
    return false;
   }));
  }

}
