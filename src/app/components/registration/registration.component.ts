import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SurveyService } from '../../services/survey.service';
import { map } from 'rxjs/operators';
import { SurveyModelServer, SurveyResponse } from '../../../../models/surveyModel';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserModelServer, UserResponse } from '../../../../models/userModel';
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

  constructor(
    private userService: UserService,
    private surveyService: SurveyService,
    private router: Router,
    private http: HttpClient) {

    this.registrationForm = new FormGroup({
      email: new FormControl('test@gmail.com', [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('xxxXXX', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('xxxXXX', [Validators.required, Validators.minLength(6)])
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
      })
      this.router.navigate(['/login'])
    };
  };
};




export interface ResponseData {
  message: string;
  user: UserModelServer
}















































  // /* Register User */
  // registerUser() {
  //   if (!this.registrationForm.valid) {
  //     return
  //   }else {

  //   let element = document.getElementById("mySelect") as HTMLSelectElement;
  //   this.option = element.options[element.selectedIndex].text
  //   let value = element.options[element.selectedIndex].value;

  //   let x = this.registrationForm.controls['specialty'].value
  //   // console.log("speciality is: ",x);
  //   x = this.option
  //   // console.log("speciality is: ",x);
  //   // console.log('form value:  ', this.registrationForm.value);

  //   this.userService.registerExpert(this.registrationForm.value).subscribe( res => {
  //     console.log("response from backend: ", res);

  //   })
  //   this.userService.registerUser(this.registrationForm.value)
  //   // this.registrationForm.reset();
  //   // this.router.navigate(['/exlogin'])

  //   // // @ts-ignore
  //   // this.registrationService.registerUser({ ...this.registrationForm.value }).subscribe((response: { message: string }) => {
  //   //   this.registrationMessage = response.message;
  //   //   console.log(response);

  //   // });


  //   };
  // };