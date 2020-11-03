
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, BehaviorSubject, Subject, of, Subscription } from "rxjs";
import { delay } from 'rxjs/operators';
import { Router } from "@angular/router";
//@ts-ignore
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken: any;
  userId: any;
  tokenSubscription = new Subscription()
  timeout;
  token

  constructor(private router: Router, private http: HttpClient, private jwtHelper: JwtHelperService) { }  // ...

  // check if the token has expired

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    // console.log('is jwtToken expired ? => ', this.jwtHelper.isTokenExpired(token));
    // return !this.jwtHelper.isTokenExpired(token);

    const decodedToken = this.jwtHelper.decodeToken(token);
    const exp = this.jwtHelper.getTokenExpirationDate(token);

    if (this.jwtHelper.isTokenExpired(token)) {
      // token expired 
      console.log('token expired');
      localStorage.clear()
      return false
    } else {
      // token valid
      console.log(exp);
      // console.log('token valid');

      return true
    };
  };

  // //store user data
  // storeUserData() { // storedUserData(token, userId)
  //   let token = localStorage.getItem('token')
  //   this.timeout = this.jwtHelper.getTokenExpirationDate(token).valueOf() - new Date().valueOf();
  //   console.log(this.jwtHelper.getTokenExpirationDate(token).valueOf());
  //   console.log(new Date().valueOf());

  //   // this.expirationCounter(this.timeout);

  // };

  // count remaining time of token to expire
  // expirationCounter(timeout) {
  //   this.tokenSubscription.unsubscribe();
  //   this.tokenSubscription = of(null).pipe(delay(timeout)).subscribe((expired) => {
  //     console.log('EXPIRED!!');

  //     // if expired call logout()
  //     this.logout();
  //     // this.router.navigate(["/login"]);
  //   });
  // }

  // on logout() delete token and userID from session Storage
  // logout() {
  //   this.tokenSubscription.unsubscribe();
  //   localStorage.clear();
  // }

}
