import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LoginUserDto } from '../shared/dtos/login-user.dto';
import { AccountService, authKey } from '../shared/services/account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account-login-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './account-login-user.component.html',
  styleUrl: './account-login-user.component.css',
})
export class AccountLoginUserComponent implements OnInit {
  loginForm!: FormGroup;
  isProcessing = false;
  returnURL = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private accountService: AccountService,
    private ar: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
    this.returnURL = this.ar.snapshot.queryParams['returnURL'] || '/';
  }

  validateControl(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && control?.touched;
  }

  hasError(controlName: string, errorName: string) {
    const control = this.loginForm.get(controlName);
    return control?.hasError(errorName);
  }

  loginUser() {
    const req: LoginUserDto = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.loginForm.disable();
    this.isProcessing = true;
    this.messageService.clear();

    this.accountService.login(req).subscribe({
      next: (res) => {
        localStorage.setItem(authKey.accessToken, res.accessToken!);
        localStorage.setItem(authKey.refreshToken, res.refreshToken!);
        this.accountService.notifyAuthChanged(true);

        this.messageService.add({
          severity: 'success',
          summary: 'Login Succeeded',
          detail: 'Nice to see you.',
        });

        this.router.navigate([this.returnURL]);
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: err.message,
          sticky: true,
        });
        this.isProcessing = false;
        this.loginForm.enable();
      },
    });
  }
}
