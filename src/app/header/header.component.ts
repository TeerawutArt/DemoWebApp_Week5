import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AccountService, authKey } from '../shared/services/account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isUserLoggedIn = false;
  userName = '';

  items!: MenuItem[];

  constructor(
    private router: Router,
    private accountService: AccountService,
    private confirmService: ConfirmationService,
    private messageService: MessageService
  ) {
    accountService.authChanged.subscribe((res) => {
      this.isUserLoggedIn = res;
      this.userName = this.accountService.getUserName();
    });
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Product',
        items: [
          {
            label: 'All',
            routerLink: '/product/list',
          },
          {
            label: 'New',
            routerLink: '/product/new',
          },
        ],
      },
    ];
  }

  gotoLogin() {
    this.router.navigate(['/account/login']);
  }

  logout() {
    this.confirmService.confirm({
      header: 'Log out?',
      message: 'Are you sure you want to log out?',
      accept: () => {
        this.accountService.logout().subscribe({
          next: (res) => {
            this.logoutUser();
          },
          error: (err: HttpErrorResponse) => {
            this.logoutUser();
          },
        });
      },
    });
  }
  private logoutUser() {
    this.accountService.notifyAuthChanged(false);
    localStorage.removeItem(authKey.accessToken);
    localStorage.removeItem(authKey.refreshToken);
    this.router.navigate(['/']);
  }
}
