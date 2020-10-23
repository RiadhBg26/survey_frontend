import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from './services/survey.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'survey';
}
