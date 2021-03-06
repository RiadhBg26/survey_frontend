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

import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  // tslint:disable-next-line:max-line-length
  emailPattern = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';
  comparePassword: boolean;
  registrationMessage: string;
  surveys: SurveyModelServer[] = [];
  speciality: SurveyModelServer;
  SERVER_URL = environment.SERVER_URL
  user: UserModelServer
  option;
  inValidMessage;
  message: string;
  id
  socialUser: SocialUser
  constructor(
    private userService: UserService,
    private surveyService: SurveyService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthenticationService,
    private toastr: ToastrService) {

    this.registrationForm = new FormGroup({
      email: new FormControl('riadhbg26@gmail.com', [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('test', [Validators.required, Validators.minLength(4)]),
      confirmPassword: new FormControl('test', [Validators.required, Validators.minLength(4)])
    });
  }

  get formControls() {
    return this.registrationForm.controls;
  }


  ngOnInit(): void { }

  /* Get surveys */
  getSurveys() {
    this.surveyService.getSurveys().subscribe((data: SurveyResponse) => {
      this.surveys = data.surveys
      // console.log(this.surveys);
    });
  };

  /* Register User */
  registerUser() {
    if (!this.registrationForm.valid) {
      return
    } else {
      this.userService.registerUser(this.registrationForm.value).subscribe(res => {
        console.log(res);
        // this.router.navigate(['/login'])
      },
      err => {
        console.log(err.error);
        this.message = err.error.error
        this.toastr.error(`${this.message}`, null, {
          timeOut: 5000,
          progressBar: false,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
        
      }
      )
    };
  };

  //sign in with google
  google() {
    this.authService.google()
  }
};


export interface ResponseData {
  message: string;
  user: UserModelServer
}


