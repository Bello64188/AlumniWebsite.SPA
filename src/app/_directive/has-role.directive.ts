import { Member } from 'src/app/_model/Member';
import { AuthService } from './../_services/auth.service';
import { Directive, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';
import { take } from "rxjs";
import {  Input} from "@angular/core";
@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
member:any;
@Input() appHasRole:string[];
  constructor(private viewContainerRef:ViewContainerRef,
    private templateRef:TemplateRef<any>,
    private authService:AuthService) {
      this.authService.currentMember$.subscribe((value:any)=>{
        this.member=value;
      });
    }
  ngOnInit(): void {
    if(!this.member?.roles || this == null){
      this.viewContainerRef.clear();
      return;
    }
    if(this.member?.roles.some((r:any)=>this.appHasRole.includes(r) )){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }else{
      this.viewContainerRef.clear();
    }

  }

}
