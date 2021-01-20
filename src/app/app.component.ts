import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationService } from './services/auth.service';
import { SurveyService } from './services/survey.service';
import { UserService } from './services/user.service';

import { NgxSpinnerService } from "ngx-spinner";

//@ts-ignore
import jwt_decode from 'jwt-decode';
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'survey';
  id;
  user;
  surveys
  token;
  message: string
  isAuthed: boolean;
  timeout: number;
  socialUser: SocialUser;
  
  
  constructor(private surveyService: SurveyService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    public authGuard: AuthGuard,
    private spinner: NgxSpinnerService,
    private socialAuthService: AuthService) {
  }

  ngOnInit(): void {
    
    //remove route query 'token'

    // this.router.navigate([], {
    //   queryParams: {
    //     'token': null,
    //     'youCanRemoveMultiple': null,
    //   },
    //   queryParamsHandling: 'merge'
    // });

    this.getSecuredRoute()
    // this.tokenDecode()
    // this.authService.checkToken()
    this.refresh()
  };


  getSecuredRoute() {
    this.userService.getSecuredRoute().subscribe(
      res => {
        this.message = res.message;
      },
      error => {
        this.router.navigate(['/login'])
      });
  };

  tokenDecode() {
    var decodedToken = jwt_decode(this.token);
    // console.log(decodedToken);
    this.timeout = decodedToken.exp
    this.id = decodedToken.user._id
  };

  logout() {
    this.authService.logout()
  };

  refresh() {
    this.authService.refresh().subscribe(res => {
      if (res.error) {
        alert(res.error)
        this.authService.onDeleteUser()
      }
    })
  }
}