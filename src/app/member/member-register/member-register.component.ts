import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/_services/member.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-member-register',
  templateUrl: './member-register.component.html',
  styleUrls: ['./member-register.component.css']
})
export class MemberRegisterComponent implements OnInit {
public showPassword:boolean=false;
registerForm : FormGroup;
  submitted:boolean=false;
  constructor(private member:MemberService, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }
public togglePasswordVisibility():void{
  this.showPassword=!this.showPassword;
}
createForm(){
  this.registerForm= this.fb.group({
    gender: ['male'],
    email: [ '',[Validators.required,Validators.email]],
    firstName: ['',Validators.required],
    lastName: ['',Validators.required],
    knownAs:['',Validators.required],
    dateOfBirth:[null,Validators.required],
    city:['',Validators.required],
    country:['',Validators.required],
    phoneNumber: ['',Validators.required],
    password: ['',[Validators.required,Validators.minLength(4), this.member.patternValidation()]],
    confirmPassword: ['',Validators.required],
    graduationYear:[null,Validators.required]

   },{validators: this.passwordMatchValidator});
}
get password(){return this.registerForm.get('password');}
get confirmPassword(){return this.registerForm.get('confirmPassword');}
onPasswordInput(){
  if (this.registerForm.hasError('mismatch')) {
    this.confirmPassword?.setErrors([{'mismatch':true}]);
  } else {
    this.confirmPassword?.setErrors(null);
  }
}
passwordMatchValidator: ValidatorFn= (p:AbstractControl): ValidationErrors | null=>{
  return p.get('password')?.value == p.get('confirmPassword')?.value ? null:{'mismatch': true};
}
get registerFormControl(){
  return this.registerForm.controls;
}
}
