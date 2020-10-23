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
  id: any = {}
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('test@gmail.com', [Validators.required]),
      password: new FormControl('xxxXXX', [Validators.required]),
    })
  }

  getLoginFormControls() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.valid) {
      this.userService.UserLogin(this.loginForm.value).subscribe((loginResponse: UserLoginResponse) => {
        this.user = loginResponse.user
        this.id = loginResponse.userId;
        console.log(loginResponse.userId);

        this.router.navigate(['/add_survey', this.id])
        console.log(this.id);
      })
    } else {
      return
    }
  };


}



// submitChoice(id) {
    
//   let dataTable = JSON.parse(localStorage.getItem('answered')) || [];
  
//   console.log(dataTable);
//   localStorage.setItem('answered surveys', JSON.stringify(dataTable))

//   const data = { choice: this.select.value };
//   const surveys = { id: id, answered: true }
//   if (this.select.value === 'no' || this.select.value == 'yes') {
//     if (dataTable) {
//       for (let j = 0; j < dataTable.length; j++) {
//         const element = dataTable[j];
//         console.log(element);
//         if (id == dataTable[j].id && dataTable[j].answered == true) {
//           // this.message = "you already answered this survey"
//           alert("you already answered this survey")
//           return
//         } else {
//           console.log('false');
//           this.surveyService.editSurvey(id, data).subscribe(res => {
//             // this.message = "answer saved"
//             alert("answer saved")
//             dataTable.push(surveys)
//             localStorage.setItem('answered surveys', JSON.stringify(dataTable));
//             return
//           })
//         }
//       }
//     }else {
//       console.log('true');
//       this.surveyService.editSurvey(id, data).subscribe(res => {
//         // this.message = "answer saved"
//         alert("answer saved")
//         dataTable.push(surveys)
//         localStorage.setItem('answered surveys', JSON.stringify(dataTable));
//         return
//       })
//     }
//   } else {
//     // this.message = 'answer should be only yes or no'
//     alert('answer should be only yes or no')
//     return
//   }
// }