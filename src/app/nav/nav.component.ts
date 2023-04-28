import { AuthService } from 'src/app/_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { faArrowRightToBracket,
          faUser,
          faUserGraduate,
           faUserPlus,
           faPhoneSquare,
           faArrowRight,
           faCalendar,
           faCalendarTimes
           } from "@fortawesome/free-solid-svg-icons";
import * as $ from 'jquery';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],

})
export class NavComponent implements OnInit {

fagraduate = faUserGraduate;
faTeacher = faUser;
faLogin  =  faArrowRightToBracket;
fajoin = faUserPlus;
faphone = faPhoneSquare;
famemory= faArrowRight;
facalendar= faCalendar
faevent =faCalendarTimes
  constructor( private authService:AuthService) { }

  ngOnInit(): void {
    document.addEventListener("DOMContentLoaded", function(){
      window.addEventListener('scroll', function() {
          if (window.scrollY > 50) {
            document.getElementById('navbar_top')?.classList.add('fixed-top');
            // add padding top to show content behind navbar
          var  navbar_height:any = document.querySelector('.navbar');
            document.body.style.paddingTop = navbar_height + 'px';
          } else {
            document.getElementById('navbar_top')?.classList.remove('fixed-top');
             // remove padding top from body
            document.body.style.paddingTop = '0';
          }
      });
    });

  }
  logOut(){
    this.authService.logout();
  }

 }
