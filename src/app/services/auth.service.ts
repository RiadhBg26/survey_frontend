
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, BehaviorSubject, Subject, of, Subscription } from "rxjs";
import { delay, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
//@ts-ignore
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  SERVER_URL = environment.SERVER_URL

  authToken: any;
  userId: any;
  timeout;
  token

  constructor(private router: Router,
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService) { }

  // check if the token has expired



  checkToken() {
    const token = localStorage.getItem('token')
    const decodedToken = this.jwtHelper.decodeToken(token);
    const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
    const isExpired = this.jwtHelper.isTokenExpired(token);
    console.log(isExpired);
    console.log(expirationDate);

  }

  refreshToken() {
    return this.httpClient.post<any>(`${this.SERVER_URL}/users/refresh`, {
      'refreshToken': this.getRefreshToken(), 'id': localStorage.getItem('id')
    }).pipe(tap((response) => {
      // console.log('refresh route response ==> ', response);
      if(response.error) return
      localStorage.setItem('token', response.token);

    }));
  }

  private getRefreshToken() {
    const refreshToken = localStorage.getItem('refresh_token')
    return refreshToken;

  }
  getJwtToken() {
    return localStorage.getItem('token');
  }

  //on logout() delete access_token and refresh_token from session Storage
  logout() {
    this.logoutFromServer()
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id')
    location.reload()
  };

  logoutFromServer(): Observable<any> {
    return this.httpClient.post<any>(`${this.SERVER_URL}/logout`, {
      'refreshToken': localStorage.getItem('refresh_token')
    })
  }


  onDeleteUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id')
    location.reload()
  };


  refresh(): Observable<any> {
    return this.httpClient.post<any>(`${this.SERVER_URL}/users/refresh`, {
      'refreshToken': this.getRefreshToken(), 'id': localStorage.getItem('id')
    })
  }
}


  //count remaining time of token to expire
  // expirationCounter() {
  //   const token = localStorage.getItem('token');
  //   const decodedToken = this.jwtHelper.decodeToken(token)
  //   const expirationDate = new Date(decodedToken.exp);
  //   this.timeout = this.jwtHelper.getTokenExpirationDate(token).valueOf() - new Date().valueOf();
  //   //expiration date should be later then actual date
  //   // console.log(expirationDate);
  //   console.log(decodedToken.exp - new Date().valueOf());
  //   if (decodedToken.exp - new Date().valueOf() ) {

  //   }

  //   this.tokenSubscription.unsubscribe();
  //   this.tokenSubscription = of(null).pipe(delay(this.timeout)).subscribe((expired) => {
  //     // if expired call logout()
  //     console.log('TOKEN EXPIRED!!');
  //     localStorage.clear()
  //     this.logout();
  //     this.router.navigate(["/login"]);
  //   });
  // }


  // public isAuthenticated(): boolean {
  //   const token = localStorage.getItem('token');
    // Check whether the token is expired and return true or false
    // return !this.jwtHelper.isTokenExpired(token);
    // if (token) {
    //   const decodedToken = this.jwtHelper.decodeToken(token);
    //   const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
    //   // console.log(decodedToken.exp);
    //   console.log('expiration date', expirationDate);

    //   console.log(new Date(decodedToken.exp));
    // }

  //   if (this.jwtHelper.isTokenExpired(token)) {
  //     // if token expired 
  //     if (token) {
  //       // console.log('token expired');
  //     }

  //     // if (token && this.jwtHelper.isTokenExpired(token) == true) {
  //     //   location.reload()
  //     // }

  //     return false
  //   } else {
  //     // if token valid            
  //     return true
  //   };
  // };
