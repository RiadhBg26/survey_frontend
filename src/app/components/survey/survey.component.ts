import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SurveyModelServer, SurveyResponse } from 'models/surveyModel';
import { UserModelServer } from 'models/userModel';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
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
  token

  constructor(private surveyService: SurveyService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) {
    // this.getSecuredRoute()
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

        var decodedToken = jwt_decode(this.token);
        // console.log(decodedToken);
        this.id = decodedToken.iss._id
        // let storedId = localStorage.setItem('id', this.id.toString())
        this.userService.getSingleUser(this.id).subscribe(data => {
          this.user = data
          console.log(data);
          
          this.surveys = this.user.surveys
        });

        if (params.get('token') != this.token) {
          const urlTree = this.router.createUrlTree([], {
            queryParams: { token: this.token },
            queryParamsHandling: "merge",
            preserveFragment: true });
          this.router.navigateByUrl(urlTree); 
        };
      });


  }


  // getSurveys() {
  //   this.surveyService.getSurveys().subscribe((data: SurveyResponse) => {
  //     this.surveys = data.surveys
  //   })
  // }
  // getSecuredRoute() {
  //   this.userService.getSecuredRoute().subscribe(
  //     data => this.username = data.toString(),
  //     error => this.router.navigate(['/login'])
  //   )
  // }
  postSurvey() {
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
    localStorage.clear()
    location.reload()
  }
}
