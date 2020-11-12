import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './auth.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(public authService: AuthenticationService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.getJwtToken()) {
            request = this.addToken(request, this.authService.getJwtToken());
        }
        return next.handle(request).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401 || error.status === 400) {
                return this.handle401Error(request, next);
            } else {
                return throwError(error);
            }
        }));
    }
    private addToken(request: HttpRequest<any>, token: string) {
        //    console.log(request.clone({ setParams: {'token': token}}));
        return request.clone({
            setParams: {
                'token': `${token}`
            }
        });
    };
    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            // console.log('if not refreshing');
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            return this.authService.refreshToken().pipe(
                switchMap((response) => {                    
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(response.token);
                    // console.log(this.refreshTokenSubject.value);
                    // console.log('refreshed 1 => ', response.token);
                    return next.handle(this.addToken(request, response.token));
                }));

        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(response => {
                    // console.log('refreshed 2 => ', response);
                    return next.handle(this.addToken(request, response));
                }));
        }
    }
}
