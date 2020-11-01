import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SurveyModelServer, SurveyResponse } from 'models/surveyModel';
import { UserModelServer } from 'models/userModel';
import { map } from 'rxjs/operators';
import { SurveyService } from 'src/app/services/survey.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  id;
  title: string;
  description: string;
  choice: string
  username: string
  user: UserModelServer
  surveys: any[] = []
  constructor(private surveyService: SurveyService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) {
      this.getUsername()
    }

  ngOnInit(): void {
    //get single user    
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      // console.log('Expert ID is: ', this.id);
      this.userService.getSingleUser(this.id).subscribe(data => {
        // this.user = Array.of(data)
        this.user = data
        this.surveys = this.user.surveys
        // console.log('surveys: ', this.user);
        this.surveys = this.user.surveys
      });
    });
  }

  
    // getSurveys() {
    //   this.surveyService.getSurveys().subscribe((data: SurveyResponse) => {
    //     this.surveys = data.surveys
    //   })
    // }
    getUsername(){
      this.userService.getUserName().subscribe(
        data => this.username = data.toString(),
        error => this.router.navigate(['/login'])
      )
    }
    saveReq() {
      const survey = {
        userId: this.id,
        title: this.title.trim(),
        description: this.description.trim(),
        choice: this.choice,
      }
      this.surveyService.postSurvey(survey).subscribe(res => {
        console.log(res);
      })
      this.title = "";
      this.description = ""
    }

    deleteSurvey(id) {
      this.surveyService.deleteSurvey(id).subscribe(res => {
        this.surveys.slice(id, 1)
        console.log(res);
        this.surveys = this.surveys
      })
    }

    logout() {
      localStorage.removeItem('token')
    }
  }
