import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from 'src/app/_services/member.service';
import { FormBuilder,
         FormGroup,
         ValidatorFn,
         AbstractControl,
         ValidationErrors,
         Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

resetForm:FormGroup;
token:string;
email:string;
resetPasswordDto:ResetPasswordDto;
public showPassword:boolean=false;
  constructor(private fb:FormBuilder, private member:MemberService,
     private activeRout:ActivatedRoute,private auth:AuthService,
     private toastr:ToastrService,private router:Router) { }

  ngOnInit(): void {
    this.createRestForm();
   this.activeRout.queryParamMap.subscribe((params:any)=>{
    this.token=params.get('token');
    this.email=params.get('email');
   })
  }
  public togglePasswordVisibility():void{
  this.showPassword=!this.showPassword;
  }
createRestForm(){
  this.resetForm= this.fb.group({
    password: ['',[Validators.required,Validators.minLength(4),this.member.patternValidation()]],
    confirmPassword: ['',Validators.required]
  },{validators:this.passwordMatchValidator});
}

get password(){return this.resetForm.get('password');}
get confirmPassword(){return this.resetForm.get('confirmPassword');}
onPasswordInput(){
  if (this.resetForm.hasError('mismatch')) {
    this.confirmPassword?.setErrors([{'mismatch':true}]);
  } else {
    this.confirmPassword?.setErrors(null);
  }
}
passwordMatchValidator: ValidatorFn= (p:AbstractControl): ValidationErrors | null=>{
  return p.get('password')?.value == p.get('confirmPassword')?.value ? null:{'mismatch': true};
}
get resetFormControl()
{
return this.resetForm.controls;
}
disableButton(event:MouseEvent){
  (event.target as HTMLButtonElement).disabled=true
    }
resetPassword(){
 this.resetPasswordDto={
email:this.email,
token:this.token,
password:this.resetForm.value.password,
confirmPassword:this.resetForm.value.confirmPassword
 }
  this.auth.ResetPassword(this.resetPasswordDto).subscribe(()=>{
    this.resetForm.reset();
this.toastr.success('Your password has been reset successfully.');
  },(e)=>{
    this.toastr.error('Unable to reset the password, please try again later.');
    this.resetForm.reset();
    this.router.navigate(['/reset-password']);
  },()=>{
this.router.navigate(['/login']);
  })
}

}
export class ResetPasswordDto{
  email:string;
  token:string;
  password:string;
  confirmPassword:string;

}
