import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { ResponseData, UserLoginResponse, UserModelServer, UserResponse } from '../../../models/userModel';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class UserService {

  SERVER_URL = environment.SERVER_URL
  constructor(private httpClient: HttpClient, private router: Router) { }


  /* ____________________________API ROUTES_________________________________________ */
  getSecuredRoute(): Observable<any> {
    return this.httpClient.get<any>(this.SERVER_URL + '/users/securedpage', {
      params: new HttpParams().append('token', localStorage.getItem('token'))})
  }
  // GET ALL UserS
  getUsers(numberOfResults = 10): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(this.SERVER_URL + '/users', {
      params: {
        limits: numberOfResults.toString()
      }
    });
  };

  //get single User
  getSingleUser(id: number): Observable<UserModelServer> {
    return this.httpClient.get<UserModelServer>(this.SERVER_URL + '/users/' + id, {
      // params: new HttpParams().append('token', localStorage.getItem('token'))
    });

  };

  // REGISTER User
  registerUser(data: any): Observable<ResponseData> {
    // console.log({ data });
    return this.httpClient.post<ResponseData>(`${this.SERVER_URL}/users/signup`, data)
  }
  //EDIT User
  editUser(id: number, data: any, image?: any): Observable<UserModelServer> {
    return this.httpClient.put<UserModelServer>(this.SERVER_URL + '/users/' + id, data, httpOptions)
  };


  // LOGIN User
  login(data: any): Observable<UserLoginResponse> {
    return this.httpClient.post<UserLoginResponse>(`${this.SERVER_URL}/users/login`, data)
  }

  google(access_token) {
    return this.httpClient.post<any>(`${this.SERVER_URL}/users/oauth/google`, {access_token})
  }
  

  // ERROR HANDLING
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }



}
