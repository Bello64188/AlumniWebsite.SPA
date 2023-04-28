import { ToastrService } from 'ngx-toastr';
import { AdminService } from './../../_services/admin.service';
import { Component, OnInit, AfterViewChecked ,TemplateRef} from '@angular/core';
import { Member } from 'src/app/_model/Member';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { strings } from '@angular-devkit/schematics';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RoleModalComponent } from 'src/app/modal/role-modal/role-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  members:any[]=[]
 userName:string='';
 bsModalRef?: BsModalRef;
  constructor(private admin:AdminService,
     private modalService:BsModalService,
     private toastr:ToastrService,
     private SpinnerService: NgxSpinnerService ) { }

  ngOnInit(): void {
this.getMemberRoles();

  }

getMemberRoles(){
  this.SpinnerService.show();
this.admin.getMemberWithRoles().subscribe((user:any)=>{
this.members=user;
this.SpinnerService.hide();
  })
}
 onBlurUsername(event:any){
  this.userName=event.target.value;
}
/**open modal */
openRolesModal(member:any){
const config={
  class:'modal-dialog-cntered',
  backdrop: true,
  ignoreBackdropClick: true,
  initialState:{
    member,
    roles: this.getRolesArray(member)
  }
}
this.bsModalRef= this.modalService.show(RoleModalComponent,config);
this.bsModalRef.content.UpdateSelectedRole.subscribe((values:any)=>{
  const rolesToUpdate={
    roles:[...values.filter((ele:any)=>ele.checked==true).map((el:any)=>el.name)]
  };
  if(rolesToUpdate){
    this.admin.updateUserRoles(member.userName,rolesToUpdate.roles).subscribe(()=>{
     this.toastr.success(`${member.userName}'s roles updated successfully.`);
      member.roles=[...rolesToUpdate.roles]
    }
   )
  }
})
}

private getRolesArray(user:any){
  const roles:any[]=[];
  const userRoles= user.roles;
  const availabilityRoles:any[]=[
    {name:'Admin',value:'Admin'},
    {name:'Moderator',value:'Moderator'},
    {name:'Member',value:'Member'},
  ];
availabilityRoles.forEach(role=>{
  let isMatch = false;
  for(const userRole of userRoles){
    if(role.name=== userRole){
      isMatch=true;
      role.checked=true;
      roles.push(role)
      break;
    }
  }
  if(!isMatch){
    role.checked=false;
    roles.push(role);
  }
})
return roles;
}
}

