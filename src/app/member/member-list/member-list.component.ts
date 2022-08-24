import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { event } from 'jquery';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  $(()=>{
    if($('#mybtn')){
 $('#mybtn').on('click',function(){
      $("#myDropdown").toggle(1000);
    });

    }

  });
  }

}
