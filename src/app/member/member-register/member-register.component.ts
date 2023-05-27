import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from './../../_model/Member';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MemberService } from 'src/app/_services/member.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-member-register',
  templateUrl: './member-register.component.html',
  styleUrls: ['./member-register.component.css'],
})
export class MemberRegisterComponent implements OnInit {
  model: Member;
  yearOfGraduations: number[] = this.generateArrayOfYears();
  public showPassword: boolean = false;
  registerForm: FormGroup;
  submitted: boolean = false;
  @Output() cancelRegistration = new EventEmitter();
  constructor(
    private member: MemberService,
    private fb: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService,
    private route: Router,
    private SpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  createForm() {
    this.registerForm = this.fb.group(
      {
        gender: ['male'],
        email: ['', [Validators.required, Validators.email]],
        userName: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.maxLength(12),
            Validators.pattern('[- +()0-9]+'),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            this.member.patternValidation(),
          ],
        ],
        confirmPassword: ['', Validators.required],
        graduationYear: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
  onPasswordInput() {
    if (this.registerForm.hasError('mismatch')) {
      this.confirmPassword?.setErrors([{ mismatch: true }]);
    } else {
      this.confirmPassword?.setErrors(null);
    }
  }
  passwordMatchValidator: ValidatorFn = (
    p: AbstractControl
  ): ValidationErrors | null => {
    return p.get('password')?.value == p.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  };
  get registerFormControl() {
    return this.registerForm.controls;
  }
  //* Register
  register() {
    this.SpinnerService.show();
    this.submitted = true;
    if (this.registerForm.valid) {
      this.model = Object.assign({}, this.registerForm.value);
      this.auth.Register(this.model).subscribe(
        () => {
          this.toastr.success('Registered successfully...');
          this.SpinnerService.hide();
        },
        (error: any) => {
          let errorResult:any= error.error
          for (let index = 0; index <  errorResult.length; index++) {
            this.toastr.error(errorResult[index]['description']);
          }
          this.SpinnerService.hide();
        },
        () => {
          this.auth.login(this.model).subscribe(() => {
            this.route.navigate(['/members']);
            this.toastr.info('Welcome to Modebe Alumni page');
            this.registerForm.reset();
            this.SpinnerService.hide();
          });
        }
      );
    }
  }
  //* cancel registration
  cancel() {
    this.submitted = false;
    this.cancelRegistration.emit(false);
    this.toastr.show('Registration cancelled..');
    this.route.navigate(['/login']);
  }
  generateArrayOfYears() {
    var max = new Date().getFullYear();
    var min = 2000;
    var years = [];
    for (var i = max; i >= min; i--) {
      years.push(i);
    }

    return years;
  }
}
