import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SurveyService } from '../../services/survey.service';
import { map } from 'rxjs/operators';
import { SurveyModelServer, SurveyResponse } from '../../../../models/surveyModel';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserLoginResponse, UserModelServer, UserResponse } from '../../../../models/userModel';
import { AuthenticationService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  SERVER_URL = environment.SERVER_URL
  email: string;
  password: string;
  loginMessage: string;
  loginForm: FormGroup;
  users: UserModelServer[] = [];
  user: UserModelServer;
  id: any = {};
  message: string;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private httpClient: HttpClient,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('riadhbg26@gmail.com', [Validators.required]),
      password: new FormControl('test', [Validators.required]),
    })
  }

  getLoginFormControls() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe((loginResponse: any) => {
        this.user = loginResponse.user
        this.id = loginResponse.userId;
        const token = loginResponse.token;
        const refreshToken = loginResponse.refreshToken;

        localStorage.setItem('token', token.toString());
        localStorage.setItem('refresh_token', refreshToken.toString());
        localStorage.setItem('id', this.id.toString());

        this.spinner.show()
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
          this.router.navigate(['/add_survey']);
          this.message = loginResponse.message
          this.toastr.success(this.message, null, {
            timeOut: 5000,
            progressBar: false,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
        }, 3000);
      },
        err => {
          console.log(err);
          this.message = err.error
          this.toastr.error(this.message, null, {
            timeOut: 5000,
            progressBar: false,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })

        })
    } else {
      this.userService.login(this.loginForm.value).subscribe(
        res => console.log(res),
        err => console.log(err)
      )
      return
    }
  };

  google() {
    this.authService.google()
  }

}

