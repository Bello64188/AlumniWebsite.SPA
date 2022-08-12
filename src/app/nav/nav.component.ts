import { Component, OnInit } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { faArrowRightToBracket, faUser, faUserGraduate, faUserPlus,faPhoneSquare,faArrowRight,faCalendar,faCalendarTimes } from "@fortawesome/free-solid-svg-icons";
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
  constructor() { }

  ngOnInit(): void {
//  $(window).on("load",()=>{ alert('welcome to Jquery');})
  }
 }
