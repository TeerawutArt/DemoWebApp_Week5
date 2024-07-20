import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-account-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './account-forgot-password.component.html',
  styleUrl: './account-forgot-password.component.css'
})
export class AccountForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  validateControl(controlName: string) {
    const control = this.forgotPasswordForm.get(controlName);
    return control?.invalid && control?.touched;
  }

  hasError(controlName: string, errorName: string) {
    const control = this.forgotPasswordForm.get(controlName);
    return control?.hasError(errorName);
  }

  forgotPassword() {

  }

}
