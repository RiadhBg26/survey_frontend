import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/auth.service';
import { SurveyService } from '../../services/survey.service';
import { map } from 'rxjs/operators';
import { SurveyModelServer, SurveyResponse } from '../../../../models/surveyModel';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserModelServer, UserResponse } from '../../../../models/userModel';
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
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
  id;
  success: boolean = false;
  socialUser: SocialUser
  resetToken: string;


  constructor(
    private userService: UserService,
    private surveyService: SurveyService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {

    this.resetPasswordForm = new FormGroup({
      password: new FormControl('test', [Validators.required, Validators.minLength(4)]),
      confirmPassword: new FormControl('test', [Validators.required, Validators.minLength(4)])
    });
  }
  get formControls() {
    return this.resetPasswordForm.controls;
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.resetToken = params.get('resetToken');
      if (this.resetToken !== localStorage.getItem('resetToken')) {
        this.router.navigate(['/home'])
      }
      // console.log(this.resetToken);
    });
  }


  /* Register User */
  resetPassword() {
    const password = this.resetPasswordForm.controls['password'].value;
    const confPassword = this.resetPasswordForm.controls['confirmPassword'].value
    if (!this.resetPasswordForm.valid || password !== confPassword) {
      return this.toastr.error(`Passwords don't match`, null, {
        timeOut: 5000,
        progressBar: false,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    } else {
      this.userService.resetPassword(this.resetPasswordForm.controls['confirmPassword'].value).subscribe(
        res => {
          console.log(res);
          this.message = res.message
          this.success = res.success
          console.log(this.success);
          
          this.toastr.success(`${this.message}`, null, {
            timeOut: 5000,
            progressBar: false,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
          localStorage.removeItem('resetToken')
          // this.router.navigate(['/login'])
        },
        err => {
          console.log(err);

        })
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
