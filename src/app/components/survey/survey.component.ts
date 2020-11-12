import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SurveyModelServer, SurveyResponse } from 'models/surveyModel';
import { UserModelServer } from 'models/userModel';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/auth.service';
import { SurveyService } from 'src/app/services/survey.service';
import { UserService } from 'src/app/services/user.service';
//@ts-ignore
import jwt_decode from 'jwt-decode';


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
  token;
  decodedToken

  constructor(private surveyService: SurveyService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    //get user with id 
    // this.route.paramMap.subscribe(params => {
    //   this.id = params.get('id');
    //   // let storedId = localStorage.setItem('id', this.id.toString())
    //   this.userService.getSingleUser(this.id).subscribe(data => {
    //     this.user = data
    //     this.surveys = this.user.surveys
    //   });
    // });
    this.route.queryParamMap
      .subscribe(params => {
        this.token = params.get('token')
        this.token = localStorage.getItem('token');
        this.decodedToken = jwt_decode(this.token);
        // console.log(this.decodedToken);
        // this.id = this.decodedToken.user.user._id        
        this.id = localStorage.getItem('id')
        this.userService.getSingleUser(this.id).subscribe(data => {
          this.user = data
          this.surveys = this.user.surveys
        });

        if (params.get('token') != this.token) {
          const urlTree = this.router.createUrlTree([], {
            queryParams: { token: this.token },
            queryParamsHandling: "merge",
            preserveFragment: true
          });

          console.log(urlTree);
          // this.router.navigateByUrl(urlTree);

        };
      });

  }
  postSurvey() {
    this.id = localStorage.getItem('id')
    console.log(this.decodedToken);
    
    if (!this.authService.getJwtToken()) {
      return
    } else {

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
  }

  deleteSurvey(id) {
    this.surveyService.deleteSurvey(id).subscribe(res => {
      this.surveys.slice(id, 1)
      console.log(res);
      this.surveys = this.surveys
    })
  }

  logout() {
    localStorage.clear()
    location.reload()
  }
}
