import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/auth.service';
import { SurveyService } from '../../services/survey.service';
import { map } from 'rxjs/operators';
import { SurveyModelServer, SurveyResponse } from '../../../../models/surveyModel';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserModelServer, UserResponse } from '../../../../models/userModel';
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {


  // tslint:disable-next-line:max-line-length
  emailPattern = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';
  email: string;
  success = false;
  message: string = '';
  error: string = '';

  constructor(
    private userService: UserService,
    private surveyService: SurveyService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthenticationService) {

  }

  ngOnInit(): void { 
    this.email = ''
  }

  
  sendEmail() {
    this.userService.passResetEmail(this.email).subscribe(
      res => { 
        // console.log(res.message);
        localStorage.setItem('resetToken', res.resetToken.toString());
        this.success = true;
        this.message = res.message.toUpperCase()
      },
      err => {
        console.log(err.error.message);
        this.success = false;
        this.error = err.error.message.toUpperCase()
      }
    )
  }

};

