import { ActivatedRoute } from '@angular/router';
import { MemberService } from 'src/app/_services/member.service';
import { ToastrService } from 'ngx-toastr';
import { Member } from './../../_model/Member';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-member-like-list',
  templateUrl: './member-like-list.component.html',
  styleUrls: ['./member-like-list.component.css']
})
export class MemberLikeListComponent implements OnInit {
members:Member[]=[];
pagination:any;
likeParams:string;
  constructor(private auth:AuthService,
    private toastr:ToastrService,
    private memberservice:MemberService,
    private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(next=>{
      this.members= next['members'].result;
      this.pagination=next['members'].pagination;
    });
  }
  loadMember(){
    this.memberservice
    .getMembers(this.pagination.currentPage,this.pagination.itemsPerPage,null, this.likeParams)
    .subscribe((response:any)=>{
      this.members= response.result;
      this.pagination = response.pagination;

    },
    (error:any)=>{
      this.toastr.error("Unable to fetch the Member, Login Please.");
    }
    )
  }
  loadMemberWithoutGraduationYear(){
    this.memberservice
    .getMembers(this.pagination.currentPage,this.pagination.itemsPerPage)
    .subscribe((response:any)=>{
      this.members= response.result;
      this.pagination = response.pagination;

    },
    (error:any)=>{
      this.toastr.error("Unable to fetch the Member, Login Please.");
    }
    )
  }
  pageChanged(event: PageChangedEvent): void{
    this.pagination.currentPage= event.page;
    this.loadMemberWithoutGraduationYear()
  }
}
