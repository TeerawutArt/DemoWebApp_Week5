import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const acs = inject(AccountService);
  const rt = inject(Router);
  const res = await acs.isUserAuthenticated();
  if (res == false) {
    rt.navigate(['/account/login'], { queryParams: { returnURL: state.url } }); //state คือ อยู่ที่ไหนตอนกดห
    return false;
  }
  return true;
};
