import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean {
    let token = localStorage.getItem('token')
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/add_survey'], {queryParams: {token}})
      return false;
    }
    return true;
  };
}