import { MemberService } from 'src/app/_services/member.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-login',
  templateUrl: './member-login.component.html',
  styleUrls: ['./member-login.component.css']
})
export class MemberLoginComponent implements OnInit {
  logForm:FormGroup;
  submitted:boolean=false;
  showpassword:boolean=false;
registerMode =false;
  constructor(private fb:FormBuilder , private member:MemberService) { }
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
}
