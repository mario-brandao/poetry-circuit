import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const isAuthenticatedGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  const user = await userService.getUser();

  if (!user.exists()) {
    router.navigate(['/landing']);
    return false;
  }
  return true;
};
