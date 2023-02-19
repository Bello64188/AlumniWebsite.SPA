import { MemberEditComponent } from './../member/member-edit/member-edit.component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
export interface IDeactivate{
  // using this interface multiple component can use this deactvate guard
  // just implement this interface in the component
  CanExit():Observable<boolean>|Promise<boolean>
  }
@Injectable({
  providedIn: 'root'
})

export class PreventUnsavedDataGuard implements CanDeactivate<MemberEditComponent> {
  canDeactivate(
    component: MemberEditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(component.editForm.dirty)
    return confirm('Are you sure you want to continue?.Any unsave chages will be lost');
      return true;
  }

}
