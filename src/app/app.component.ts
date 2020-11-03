import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { SurveyService } from './services/survey.service';
import { UserService } from './services/user.service';
//@ts-ignore
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'survey';
  id;
  user;
  surveys
  token;
  username
  isAuthed: boolean;
  timeout;
  expirationTime;
  creationTime
  constructor(private surveyService: SurveyService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    public authGuard: AuthGuard) {
    this.getSecuredRoute()
  }

  ngOnInit(): void {
    //get user with id   
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      // let storedId = localStorage.setItem('id', JSON.stringify(this.id))
      this.userService.getSingleUser(this.id).subscribe(data => {
        this.user = data
        this.surveys = this.user.surveys
      });
    });
    //get user with token
    this.route.queryParamMap
      .subscribe(params => {
        this.token = params.get('token');
        this.token = localStorage.getItem('token');
        if (params.get('token') != this.token && this.authService.isAuthenticated() == true) {
          const urlTree = this.router.createUrlTree([], {
            queryParams: { token: this.token },
            queryParamsHandling: "merge",
            preserveFragment: true });
          this.router.navigateByUrl(urlTree); 
        }
      });
      if (this.authService.isAuthenticated() == false) {
        localStorage.clear()
        this.router.navigate(['/login'])
      }
      this.tokenDecode()
  }

  getSecuredRoute() {
    this.userService.getSecuredRoute().subscribe(
      data => {this.username = data.email},
      error => this.router.navigate(['/login'])
    )
  };

  tokenDecode() {
    var decodedToken = jwt_decode(this.token);
    console.log(decodedToken);
    this.timeout = decodedToken.exp
    this.id = decodedToken.iss._id
    
    this.expirationTime = decodedToken.exp
    this.creationTime = decodedToken.iat
    
    console.log(new Date(this.creationTime));
    console.log(new Date(this.expirationTime));

  }



  logout() {
    localStorage.clear()
    location.reload()
  };


}
