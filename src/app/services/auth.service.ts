
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
import { AuthService, GoogleLoginProvider, SocialLoginModule, SocialUser } from 'angularx-social-login';
import { UserService } from './user.service';

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
  id;
  socialUser: SocialUser

  constructor(private router: Router,
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService,
    private socialAuthService: AuthService,
    private userService: UserService) { }

  
  // check if the token has expired
  checkToken() {
    const token = localStorage.getItem('token')
    const decodedToken = this.jwtHelper.decodeToken(token);
    const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
    const isExpired = this.jwtHelper.isTokenExpired(token);
    console.log(isExpired);
    console.log(expirationDate);

  }

  //refresh token when expired
  refreshToken() {
    return this.httpClient.post<any>(`${this.SERVER_URL}/users/refresh`, {
      'refreshToken': this.getRefreshToken(), 'id': localStorage.getItem('id')
    }).pipe(tap((response) => {
      // console.log('refresh route response ==> ', response);
      if(response.error) return
      localStorage.setItem('token', response.token);

    }));
  }

  getRefreshToken() {
    const refreshToken = localStorage.getItem('refresh_token')
    return refreshToken;

  };

  getJwtToken() {
    return localStorage.getItem('token');
  };

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

  // if user is deleted from the database
  onDeleteUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id')
    location.reload()
  };

  //manually refresh token with a button
  refresh(): Observable<any> {
    return this.httpClient.post<any>(`${this.SERVER_URL}/users/refresh`, {
      'refreshToken': this.getRefreshToken(), 'id': localStorage.getItem('id')
    })
  }

  //sign in with google
  google() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
    // console.log(this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID));
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      // console.log(this.socialUser);
      const token = this.socialUser.authToken
      const access_token = {token}
      this.userService.google(access_token.token).subscribe(res => {
        // console.log('OAuth reponse => ', res.user._id);
        this.id = res.user._id
        // console.log(access_token.token);
        localStorage.setItem('token', access_token.token.toString())
        localStorage.setItem('id', this.id.toString())
        this.router.navigate(['/add_survey'], {queryParams: {token: access_token.token}})
        
      })
      
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
