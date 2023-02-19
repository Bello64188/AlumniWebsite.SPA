import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
AdminUrl= environment.AdminApi;
  constructor(private http:HttpClient) { }

  getMemberWithRoles(){
    return this.http.get(this.AdminUrl+ 'users-with-roles')
  }
  updateUserRoles(userName:any,roles:any[]){
   return this.http.post(this.AdminUrl+'edit-roles/'+ userName +'?roles=' + roles,{})
  }
  getUnApprovedPhoto(){
    return this.http.get(this.AdminUrl +'photo-to-moderate');
  }
  approvePhoto(id:number){
    return this.http.post(this.AdminUrl+'approve-photo/' + id,{})

  }
  rejectPhoto(id:number){
    return this.http.post(this.AdminUrl+'reject-photo/' + id,{})

  }
}
