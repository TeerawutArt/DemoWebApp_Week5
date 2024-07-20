import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CustomValidatorService } from '../shared/services/custom-validator.service';

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
    ButtonModule
  ],
  templateUrl: './account-register-user.component.html',
  styleUrl: './account-register-user.component.css'
})
export class AccountRegisterUserComponent implements OnInit {
  roles = ['Customer', 'Seller'];
  registerForm!: FormGroup;

  constructor(private customeValidatorService: CustomValidatorService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });

    this.registerForm.get('confirmPassword')?.addValidators(this.customeValidatorService.mismatched(this.registerForm.get('password')!));
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

  }

}
