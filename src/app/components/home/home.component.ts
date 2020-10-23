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
  surveyId
  select : FormControl
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
        // this.user = Array.of(data)
        this.user = data
        this.surveys = this.user.subjects
        // console.log('surveys: ', this.user);
        this.surveys = this.user.subjects

      });
    });
    this.getSurveys()
    this.getUsers()
    // this.disableInput()
  }
  getUsers() {
    this.userService.getUser().subscribe((res: UserResponse) => {
      this.users = res.users
      // console.log(this.users);
    })
  }
  getSurveys() {
    this.surveyService.getSurveys().subscribe((data: SurveyResponse) => {
      this.surveys = data.surveys
      // console.log(this.surveys);
      for (let i = 0; i < this.surveys.length; i++) {
        this.yesPercentage = this.surveys[i].yesPercentage
        this.noPercentage = this.surveys[i].noPercentage
        // console.log(this.yesPercentage, this.noPercentage);
      }
    })
  }

submitChoice(id) {
    
  
  console.log(this.tab);
  localStorage.setItem('answered surveys', JSON.stringify(this.tab))

  const data = { choice: this.select.value };
  const surveys = { id: id, answered: true }
  if (this.select.value === 'no' || this.select.value == 'yes') {
    if (this.tab) {
      for (let j = 0; j < this.tab.length; j++) {
        const element = this.tab[j];
        console.log(element);
        if (id == this.tab[j].id && this.tab[j].answered == true) {
          // this.message = "you already answered this survey"
          alert("you already answered this survey")
          return
        } else {
          console.log('false');
          this.surveyService.editSurvey(id, data).subscribe(res => {
            // this.message = "answer saved"
            alert("answer saved")
            // this.tab.push(surveys)
            // localStorage.setItem('answered surveys', JSON.stringify(this.tab));
            return
          })
        }
      }
    }else {
      console.log('true');
      this.surveyService.editSurvey(id, data).subscribe(res => {
        // this.message = "answer saved"
        alert("answer saved")
        // this.tab.push(surveys)
        // localStorage.setItem('answered surveys', JSON.stringify(this.tab));
        return
      })
    }
  } else {
    // this.message = 'answer should be only yes or no'
    alert('answer should be only yes or no')
    return
  }
}




}
