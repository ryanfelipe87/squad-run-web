import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceTs {
  private api = environment.apiUrl;

  constructor(private http: HttpClient){}

  getUsers(){
    return this.http.get(`${this.api}/users`);
  }

  login(data: any){
    return this.http.post(`${this.api}/login/authenticate`, data);
  }
}
