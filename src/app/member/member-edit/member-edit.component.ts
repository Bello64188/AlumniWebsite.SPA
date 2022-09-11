import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../_services/auth.service';
import { MemberService } from 'src/app/_services/member.service';
import { Member } from './../../_model/Member';
import { Component, OnInit,ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { faThList } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
member:any
photoUrl:string;
@ViewChild('editForm') editForm:NgForm;
  constructor(
    private memservice:MemberService,
    private auth:AuthService,
    private route:ActivatedRoute,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data=>{
      this.member=data['member']
    });
    this.auth.currentPhotoUrl.subscribe(photoUrl=>this.photoUrl=photoUrl);

  }
updateMember(){
  this.memservice.updateMember(this.auth.decodeToken.id,this.member).
  subscribe(next=>{
    this.toastr.success("User Profile Update!!!");
    this.editForm.reset(this.member);
  },err=>{
    this.toastr.error('Failed to Update your profile');
  })
}
updatePhotoUrl(photourl:any){
this.member.photoUrl=photourl;
}
}
