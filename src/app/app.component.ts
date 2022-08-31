import { Member } from './_model/Member';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
 jwtHleper:JwtHelperService = new JwtHelperService();
  title = 'AlumniWebsite.SPA';
  constructor(private auth:AuthService){}
  ngOnInit(): void {
   const token = localStorage.getItem('token');
   const member:Member = JSON.parse(localStorage.getItem('memberFromDto')??'');
   if(token)
   this.auth.decodeToken=this.jwtHleper.decodeToken(token);
   if(member){
    this.auth.currentUser=member;
    if(this.auth.currentUser.photoUrl !== null)
    this.auth.changeMemberPhoto(member.photoUrl);
    else
    this.auth.changeMemberPhoto('../assets/images/graduateImg.jpg');
   }
  }
}
