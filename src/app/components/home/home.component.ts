import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SurveyModelServer, SurveyResponse } from 'models/surveyModel';
import { UserModelServer, UserResponse } from 'models/userModel';
import { map } from 'rxjs/operators';
import { SurveyService } from 'src/app/services/survey.service';
import { UserService } from 'src/app/services/user.service';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-survey',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  id;
  title: string;
  description: string;
  choice: string
  choicesCounter: number
  users: UserModelServer[] = []
  user: UserModelServer
  surveys: any[] = []
  message: string
  array = []
  number: number
  yesCounter: number
  yesPercentage: any
  noPercentage: any
  choices: any
  noCounter
  tab;
  username: string
  disable = false
  err = false
  success = false
  select: FormControl
  token
  answer;
  constructor(private surveyService: SurveyService,
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {

    this.select = new FormControl()
  }

  ngOnInit(): void {

    //get single user    
    // this.route.paramMap.subscribe(params => {
    //   this.id = params.get('id');
    //   this.userService.getSingleUser(this.id).subscribe(data => {
    //     this.user = data
    //     this.surveys = this.user.surveys

    //   });
    // });
    // this.route.queryParamMap
    //   .subscribe(params => {
    //     this.token = params.get('token')
    //     this.token = localStorage.getItem('token')

    //     if (params.get('token') != this.token) {
    //       const urlTree = this.router.createUrlTree([], {
    //         queryParams: { token: this.token },
    //         // queryParamsHandling: "merge",
    //         preserveFragment: true
    //       });

    //       this.router.navigateByUrl(urlTree);
    //     }
    //     this.id = localStorage.getItem('id')
    //     this.userService.getSingleUser(this.id).subscribe(data => {
    //       this.user = data;
    //       this.surveys = this.user.surveys;
          
    //     })
    //   });
    this.router.navigate([], {
      queryParams: {
        'token': null,
        'youCanRemoveMultiple': null,
      },
      queryParamsHandling: 'merge'
    });

    this.getSurveys()
    this.getUsers()
  }
  getUsers() {
    this.userService.getUsers().subscribe((res: UserResponse) => {
      this.users = res.users
    })
  }
  getSurveys() {
    this.surveyService.getSurveys().subscribe((data: SurveyResponse) => {
      this.surveys = data.surveys
      // console.log(this.surveys);
      for (let i = 0; i < this.surveys.length; i++) {
        this.yesPercentage = this.surveys[i].yesPercentage
        this.noPercentage = this.surveys[i].noPercentage
      }

    })
  };

  submitChoice(id) {
    if (!this.authService.getJwtToken()) {
      return
    } else {
      /* ____________with radio button ____________*/
      // console.log(this.answer);
      // this.select.patchValue(this.answer)
      /* ________________________________________ */
      
      const controlValue = this.select.value.toLowerCase()
      // console.log(controlValue, this.answer);
      
      const data = { choice: controlValue};
      const surveys = { id: id, answered: true }      
      if (controlValue  == 'no' || controlValue  == 'yes') {
        this.surveyService.editSurvey(id, data).subscribe((res: SurveyEditionResponse) => {
          this.message = res.message
          // console.log(this.message);
          if (this.message == 'answer saved !') {
            this.select.patchValue('')
            this.success = true
            this.err = false
            this.toastr.success(`${this.message}`, null, {
              timeOut: 1500,
              progressBar: false,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            })
            return
          } else
            this.message = res.message
          this.toastr.error(`${this.message}`, null, {
            timeOut: 1500,
            progressBar: false,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
          this.select.patchValue('')
          this.success = false
          this.err = true
          return
        })
      } else {
        this.select.patchValue('')
        this.success = false
        this.err = true
        this.message = 'answer should be only yes or no'
        this.toastr.error(`${this.message}`, null, {
          timeOut: 1500,
          progressBar: false,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
        return
      }
    }
  };

  logout() {
    localStorage.removeItem('token')
    location.reload()
  };


  getValue() {
    let x = document.querySelector('input[name="radio"]:checked') as HTMLInputElement;
    console.log(x.value);
    
  }
};



export interface SurveyEditionResponse {
  message: string;
  survey: SurveyModelServer
}