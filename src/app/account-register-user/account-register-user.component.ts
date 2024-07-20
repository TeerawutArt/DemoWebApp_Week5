import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CustomValidatorService } from '../shared/services/custom-validator.service';
import { RegisterUserDto } from '../shared/dtos/register-user.dto';
import { AccountService } from '../shared/services/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-account-register-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    RadioButtonModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './account-register-user.component.html',
  styleUrl: './account-register-user.component.css',
})
export class AccountRegisterUserComponent implements OnInit {
  roles = ['Customer', 'Seller'];
  registerForm!: FormGroup;
  returnURL = '';
  isProcessing = false;

  constructor(
    private customeValidatorService: CustomValidatorService,
    private accService: AccountService,
    private rt: Router,
    private ar: ActivatedRoute,
    private msgs: MessageService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
    this.returnURL = this.ar.snapshot.queryParams['returnURL'] || '/';

    this.registerForm
      .get('confirmPassword')
      ?.addValidators(
        this.customeValidatorService.mismatched(
          this.registerForm.get('password')!
        )
      );
  }

  validateControl(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control?.invalid && control?.touched;
  }

  hasError(controlName: string, errorName: string) {
    const control = this.registerForm.get(controlName);
    return control?.hasError(errorName);
  }

  registerUser() {
    const req: RegisterUserDto = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      role: this.registerForm.get('role')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      confirmPassword: this.registerForm.get('confirmPassword')?.value,
    };
    this.msgs.clear();
    this.isProcessing = true;
    this.registerForm.disable();
    this.accService.register(req).subscribe({
      next: () => {
        this.msgs.add({
          summary: 'Register Succeeded',
          detail: 'Now you can login',
          severity: 'success',
        });
        this.rt.navigate(['/account/login'], {
          queryParams: { returnURL: this.returnURL },
        });
      },
      error: (err: HttpErrorResponse) => {
        this.isProcessing = false;
        this.registerForm.enable();
        this.msgs.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: err.error.errors[0],
          sticky: true,
        });
      },
    });
  }
}
