import { ToastrService } from 'ngx-toastr';
import { AuthService, ForgetPassword } from 'src/app/_services/auth.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
forgetPassForm:FormGroup;
issent:boolean=false;
forgetPasswordDto:ForgetPassword
  constructor(private fb:FormBuilder, private auth:AuthService,private toastr:ToastrService) { }

  ngOnInit(): void {
   this.createForgetPass();
  }

  createForgetPass(){
    this.forgetPassForm = this.fb.group(
{
  email:['',[Validators.required,Validators.email]]
});
  }
 get forgetPassControl(){
  return this.forgetPassForm.controls;
}
forgetPassword(){
  this.forgetPasswordDto={
     email:this.forgetPassForm.value.email,
     clientUrl:'http://localhost:4200/reset-password'
  }
  this.auth.ForgetPassword(this.forgetPasswordDto).subscribe(()=>{
this.toastr.info('The link has been sent, please check your email to reset your password.');
  },
  (error)=>{
    this.toastr.error('Unable to reset password.');
  }
  );
}
}
