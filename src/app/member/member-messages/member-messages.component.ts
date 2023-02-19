import { PaginatedResult, Pagination } from './../../_model/Pagination';
import { MemberService } from 'src/app/_services/member.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { Message } from 'src/app/_model/Message';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
messages :any[]=[];
pagination:Pagination;
messageContainer='unread';
memberParams:any={};
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private toastr: ToastrService,
    private memberService: MemberService
  ) { }

  ngOnInit(): void {
this.route.data.subscribe(data=>{
  console.log(data);
  this.messages= data['messages'].result;
  this.pagination= data['messages'].pagination;
});
  }
  loadMessages(){
    this.memberService.getMessages(this.auth.decodeToken.id,this.pagination.currentPage
      ,this.pagination.itemsPerPage,this.messageContainer).subscribe((res:PaginatedResult<Message[]>)=>{
        this.messages= res.result;
        this.pagination=res.pagination;
      },err=>{
        this.toastr.error('Unable to load the messages');
      })

      }
       deleteMessage(id:number){
        Swal.fire({
          title:'About to delete message are you sure?',
          showDenyButton:true,
          showCancelButton:true,
          confirmButtonText:'Delete',
          denyButtonText:`Don't delete`
        }).then((result):any=>{
            if(result.isConfirmed){
              this.memberService.deleteMessage(id,this.auth.decodeToken.id).subscribe(()=>{
               this.messages.splice(this.messages.findIndex(p=>p.id===id), 1);
               Swal.fire("Message Deleted", '', 'success');
              },
              (error)=>{
                this.toastr.error("Unable to delete message.");
              })
            }else if(result.isDenied){
              Swal.fire('Delete Cancel', '', 'info');
            }
        });

       }

      // loadMemberWithoutGraduationYear(){
      //   this.memberService
      //   .getMembers(this.pagination.currentPage,this.pagination.itemsPerPage)
      //   .subscribe((response:any)=>{
      //     this.messages= response.result;
      //     this.pagination = response.pagination;

      //   },
      //   (error:any)=>{
      //     if(this.memberParams.gradationYear == null)
      //     this.toastr.warning("please Select Graduation Year");
      //     this.toastr.error("Unable to fetch the Member, Login Please.");
      //   }
      //   )
      // }

      pageChanged(event: PageChangedEvent): void {
        this.pagination.currentPage= event.page;
        this.loadMessages();
         }
}
