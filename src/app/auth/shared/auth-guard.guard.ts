import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from 'src/app/auth/shared/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate() {
    return new Observable<boolean>(observer => {
      this.authService.user.subscribe(user => {

        if (!user.emailVerified) {
          this.router.navigate(['login']);
          return observer.next(false);
        }

        return observer.next(true);
      });
    });
  }
}
