import { MemberService } from 'src/app/_services/member.service';
import { FormBuilder, FormGroup, ValidatorFn, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
resetForm:FormGroup;
public showPassword:boolean=false;
  constructor(private fb:FormBuilder, private member:MemberService) { }

  ngOnInit(): void {
    this.createRestForm();
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

}
