import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from './../../_model/Member';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/_services/member.service';
import { AbstractControl,
   FormBuilder,
    FormControl,
    FormGroup,
    NgForm,
    ValidationErrors,
    ValidatorFn,
    Validators } from '@angular/forms';

@Component({
  selector: 'app-member-register',
  templateUrl: './member-register.component.html',
  styleUrls: ['./member-register.component.css']
})
export class MemberRegisterComponent implements OnInit {
  model:Member
public showPassword:boolean=false;
registerForm : FormGroup;
  submitted:boolean=false;
  constructor(private member:MemberService,
     private fb:FormBuilder, private auth:AuthService,
     private toastr:ToastrService,private route:Router) { }

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
//* Register
register(){
  this.submitted=true;
  if (this.registerForm.valid) {
    this.member= Object.assign({},this.registerForm.value);
    this.auth.Register(this.model).subscribe(()=>{
    this.toastr.success("Register Successfully...");

    },
    (error:any)=>{
      this.toastr.error("Registration Failed.");
    },
    ()=>{
      this.auth.login(this.model).subscribe(()=>{
      this.route.navigate(['/members']);
      this.toastr.info("Welcome to Modebe Alumni Page")
      });
    }
    );
  }
}
}
