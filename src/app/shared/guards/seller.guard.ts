import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

export const sellerGuard: CanActivateFn = (route, state) => {
  const acs = inject(AccountService);
  const rt = inject(Router);
  if (!acs.isUserInRole('Seller')) {
    rt.navigate(['/forbidden'], { queryParams: { returnURL: state.url } });
    return false;
  }
  return true;
};
