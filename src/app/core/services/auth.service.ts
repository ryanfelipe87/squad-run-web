import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceTs {
  private api = environment.apiUrl;

  constructor(private http: HttpClient){}

  register(data: any){
    return this.http.post(`${this.api}/register/create`, data);
  }

  login(data: any){
    return this.http.post(`${this.api}/login/authenticate`, data)
      .pipe(tap((response: any) => {
        localStorage.setItem('token', response.access_token);
      }));
  }

  logout(){
    localStorage.removeItem('token');
  }
}
