import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 url = environment.weatherUrl;
  constructor(private http:HttpClient) { }
  getWeather():Observable<any>{
    return this.http.get(this.url);
  }

}



