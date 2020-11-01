import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SurveyModelServer, SurveyResponse } from 'models/surveyModel';
import { UserModelServer, UserResponse } from 'models/userModel';
import { map } from 'rxjs/operators';
import { SurveyService } from 'src/app/services/survey.service';
import { UserService } from 'src/app/services/user.service';

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
  disable = false
  err = false
  success = false
  select: FormControl
  constructor(private surveyService: SurveyService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,) {
    this.select = new FormControl()
  }

  ngOnInit(): void {

    //get single user    
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.userService.getSingleUser(this.id).subscribe(data => {
        this.user = data
        this.surveys = this.user.surveys

      });
    });
    this.getSurveys()
    this.getUsers()
    // this.disableInput()
  }
  getUsers() {
    this.userService.getUser().subscribe((res: UserResponse) => {
      this.users = res.users
    })
  }
  getSurveys() {
    this.surveyService.getSurveys().subscribe((data: SurveyResponse) => {
      this.surveys = data.surveys
      
      
    console.log(this.surveys);
      for (let i = 0; i < this.surveys.length; i++) {
        this.yesPercentage = this.surveys[i].yesPercentage
        this.noPercentage = this.surveys[i].noPercentage
        
      }
    
    })
  }

  submitChoice(id) {
    const data = { choice: this.select.value };
    const surveys = { id: id, answered: true }
    if (this.select.value === 'no' || this.select.value == 'yes') {

      this.surveyService.editSurvey(id, data).subscribe((res: SurveyEditionResponse) => {
        this.message = res.message
        console.log(this.message);
        if (this.message == 'answer saved !') {
          this.success = true
          this.err = false
        }else
        this.success = false
        this.err = true
        return
      })
    }else {
        this.success = false
        this.err = true
          this.message = 'answer should be only yes or no'
          return
        }
  }

  

}


export interface SurveyEditionResponse {
  message: string;
  survey: SurveyModelServer
}