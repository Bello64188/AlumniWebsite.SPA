import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../_services/auth.service';
import { MemberService } from 'src/app/_services/member.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-member-login',
  templateUrl: './member-login.component.html',
  styleUrls: ['./member-login.component.css']
})
export class MemberLoginComponent implements OnInit {
  userToken:any;
  decodeToken:any;
  model:any={};
  logForm:FormGroup;
  submitted:boolean=false;
  showpassword:boolean=false;
  public jwtHelper:JwtHelperService= new JwtHelperService();
registerMode =false;
  constructor(private fb:FormBuilder ,
     private member:MemberService,
     private auth:AuthService,
     private toastr:ToastrService,
     private route:Router,
     private SpinnerService: NgxSpinnerService) { }
  ngOnInit(): void {
   this.createLog();
  }
  createLog(){
    this.logForm = this.fb.group({
      email: ['',[Validators.required,Validators.email]],
      password: ['',[Validators.required,Validators.min(4),this.member.patternValidation()]]
    });
  }
registerToggle(){
  this.registerMode =true
}
 get logFormControl(){
 return this.logForm.controls;
}
showHidePassword(){
  this.showpassword= !this.showpassword;
}
/**
 * subscribed to model from authService login
 * if is not login navigate to register Page
 * @returns
 */
Login(){

    this.SpinnerService.show();
  return this.auth.login(this.model).subscribe((data:any)=>{

    this.toastr.success("Login successfully");
    this.SpinnerService.hide();
  },
  (err:any)=>{
    this.toastr.error('Check your email and password.');
    this.SpinnerService.hide();
  },
  ()=>{
    //! use member list page here
    this.route.navigate(['/members']);
    this.toastr.info("Welcome Modebe Alumni page!");
    this.SpinnerService.hide();
  }
  )
}


}
