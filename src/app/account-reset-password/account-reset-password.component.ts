import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CustomValidatorService } from '../shared/services/custom-validator.service';
import { PasswordModule } from 'primeng/password';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordDto } from '../shared/dtos/reset-password.dto';
import { MessageService } from 'primeng/api';
import { AccountService } from '../shared/services/account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './account-reset-password.component.html',
  styleUrl: './account-reset-password.component.css'
})
export class AccountResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;

  constructor(
    private customValidator: CustomValidatorService) { }

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });

    this.resetPasswordForm.get('confirmPassword')?.addValidators(this.customValidator.mismatched(this.resetPasswordForm.get('password')!));
  }

  validateControl(controlName: string) {
    const control = this.resetPasswordForm.get(controlName);
    return control?.invalid && control?.touched;
  }

  hasError(controlName: string, errorName: string) {
    const control = this.resetPasswordForm.get(controlName);
    return control?.hasError(errorName);
  }

  resetPassword() {

  }
}
