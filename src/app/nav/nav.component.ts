import { Component, OnInit } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { faArrowRightToBracket, faUser, faUserGraduate, faUserPlus,faPhoneSquare,faUmbrella,faCalendar,faCalendarTimes } from "@fortawesome/free-solid-svg-icons";
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
famemory= faUmbrella;
facalendar= faCalendar
faevent =faCalendarTimes
  constructor() { }

  ngOnInit(): void {
  }

}
