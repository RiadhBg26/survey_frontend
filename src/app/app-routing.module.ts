import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SurveyComponent } from './components/survey/survey.component';

import {  AuthGuard as AuthGuard } from './guards/auth.guard'
import {  LoggerGuard  } from './guards/logger.guard'

const routes: Routes = [
  {path:'', redirectTo:'register', pathMatch:'full'},
  {path:'register', component: RegistrationComponent, canActivate: [LoggerGuard]},
  {path:'login', component: LoginComponent, canActivate: [LoggerGuard]},
  // {path:'add_survey/:id', component: SurveyComponent, canActivate: [AuthGuard]},
  // {path:'main',  component: AppComponent},
  {path:'add_survey',  component: SurveyComponent,  canActivate: [AuthGuard]},
  {path:'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'forgot_password', component: ForgotPasswordComponent},
  {path: 'reset/:resetToken', component: ResetPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
