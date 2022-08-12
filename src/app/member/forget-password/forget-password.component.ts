import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
forgetPassForm:FormGroup;
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
   this.createForgetPass();
  }

  createForgetPass(){
    this.forgetPassForm = this.fb.group(
{
  email:['',[Validators.required,Validators.email]]
}
    )
  }
 get forgetPassControl(){
  return this.forgetPassForm.controls;
}

}
