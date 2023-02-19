import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.css']
})
export class RoleModalComponent implements OnInit{
  @Input() UpdateSelectedRole= new EventEmitter();
  member:any;
  roles:any[]
 constructor(public bsModalRef:BsModalRef){}
  ngOnInit(): void {

  }
  updateRole(){
   this.UpdateSelectedRole.emit(this.roles);
   console.log(this.UpdateSelectedRole);
   this.bsModalRef.hide();
  }
}
