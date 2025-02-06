import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { db } from 'src/db';

export const firstAcessGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  return db.user.get(1).then((user) => {
    if (user?.firstAccess === false) {
      return true;
    } else {
      router.navigate(['/landing']);
      return false;
    }
  });
};
