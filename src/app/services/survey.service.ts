import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {SurveyModelServer, SurveyResponse } from '../../../models/surveyModel';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  SERVER_URL = environment.SERVER_URL
  constructor(private httpClient: HttpClient, private router: Router,
    ) { }

    getSurveys(): Observable<SurveyResponse> {
    return this.httpClient.get<SurveyResponse>(this.SERVER_URL + '/survey')
  };

  //get single Expert
  getSingleSurvey(id: number): Observable <SurveyModelServer> {
    return this.httpClient.get<SurveyModelServer>(this.SERVER_URL +'/survey/' + id);
    
  };

  postSurvey( data: any): Observable <any> {
    return this.httpClient.post<any>(this.SERVER_URL + '/survey', data, httpOptions)
  }

  deleteSurvey(id: number): Observable <SurveyModelServer> {
    return this.httpClient.delete<SurveyModelServer>(this.SERVER_URL + '/survey/' + id);
  }
  
  editSurvey(id: number, data: any): Observable <SurveyModelServer> {
    return this.httpClient.put<SurveyModelServer>(this.SERVER_URL + '/survey/' + id, data, httpOptions)
  };

}