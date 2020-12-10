import { Injectable } from '@angular/core';
import { CanActivate, Navigation, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SameRouteGuardGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate() {
    const currentNavigation = this.router.getCurrentNavigation();
    const previousNavigation = currentNavigation.previousNavigation;

    if (previousNavigation === null) {
      return this.router.navigate(['/']);
    }

    if (previousNavigation.finalUrl.toString() === currentNavigation.finalUrl.toString()) {
      return this.router.navigate(['/']);
    }

    return true;
  }
}
