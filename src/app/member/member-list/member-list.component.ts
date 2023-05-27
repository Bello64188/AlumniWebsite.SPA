import { Pagination } from './../../_model/Pagination';
import { AuthService } from './../../_services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from './../../_services/member.service';
import { Member } from './../../_model/Member';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
members:Member[]=[];
member:Member= JSON.parse(localStorage.getItem('memberFromDto')??'');
pagination:Pagination;
genderList=[
  {value:'all',display:'All'},
  {value:'male',display:'Males'},
  {value:'female',display:'Females'}
];
memberParams:any={};
photoUrl:string;
yearOfGraduations:number[]= this.generateArrayOfYears();
  constructor(private memberServ:MemberService,private toastr:ToastrService,
   private route:ActivatedRoute, public auth:AuthService,  private SpinnerService: NgxSpinnerService ) { }

  ngOnInit(): void {

    this.yearOfGraduations;
    //* jquery function that toggle the button as dropdown
  $(()=>{
    if($('#mybtn')){
 $('#mybtn').on('click',function(){
      $("#myDropdown").toggle(1000);
    });
    }
  });
  //* getting memeber data through resolver
  this.route.data.subscribe(data=>{
  this.members=data['members'].result;
  this.pagination=data['members'].pagination;
  });
  this.memberParams.gender='all';
  this.memberParams.orderBy ='lastactive';
  this.memberParams.graduationYear=this.member.graduationYear;

  //* subscribed to behaviorSubject for photoUrl
  this.auth.currentPhotoUrl.subscribe(photoUrl=>this.photoUrl=photoUrl);

  }
  //* loaduser method when you apply filter or sorting
loadMember(){
  this.SpinnerService.show();
  this.memberServ
  .getMembers(this.pagination.currentPage,this.pagination.itemsPerPage, this.memberParams)
  .subscribe((response:any)=>{
    this.members= response.result;
    this.pagination = response.pagination;
this.SpinnerService.hide();
  },
  (error:any)=>{
    if(this.memberParams.gradationYear == null)
    this.toastr.warning("please select graduation year");
    this.toastr.error("Unable to fetch the member, login please.");
    this.SpinnerService.hide();
  }
  )
}
loadMemberWithoutGraduationYear(){
  this.SpinnerService.show();
  this.memberServ
  .getMembers(this.pagination.currentPage,this.pagination.itemsPerPage)
  .subscribe((response:any)=>{
    this.members= response.result;
    this.pagination = response.pagination;
    this.SpinnerService.hide();
  },
  (error:any)=>{
    if(this.memberParams.gradationYear == null)
    this.toastr.warning("please select graduation year");
    this.toastr.error("Unable to fetch the member, login please.");
    this.SpinnerService.hide();
  }
  )
}
//* Reset Filter
resetFilter()
{
this.memberParams.gender = this.member.gender === 'female'? 'male': 'female';
this.memberParams.orderBy = 'lastactive';
this.loadMember();
}
//* page change as you press next button

pageChanged(event: PageChangedEvent): void{
  this.pagination.currentPage= event.page;
  this.loadMemberWithoutGraduationYear()
}
generateArrayOfYears() {
  var max = new Date().getFullYear();
  var min = 2000;
  var years = [];
  for (var i = max; i >= min; i--) {
    years.push(i);
  }

  return years;
}
}
