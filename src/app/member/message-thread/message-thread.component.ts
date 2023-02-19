import { tap} from 'rxjs';
import { Component, OnInit,Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-message-thread',
  templateUrl: './message-thread.component.html',
  styleUrls: ['./message-thread.component.css']
})
export class MessageThreadComponent implements OnInit {
  @Input() memberId:string;
 messages:any[]=[];
 newMessage:any ={};
  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private memberService: MemberService
  ) { }

  ngOnInit(): void {
    this.getMessageThread();
  }
  getMessageThread(){
    const currentMemberId =  this.auth.decodeToken.id;
    return this.memberService.getMessageThread(this.auth.decodeToken.id,this.memberId).pipe(
      tap(message=>{
        for(let i= 0; i < message.length; i++){
if(message[i].isRead===false && message[i].recipientId===currentMemberId){
  this.memberService.markAsRead(currentMemberId,message[i].id);
}
        }
      })
    ).subscribe(next=>{
      this.messages=next;
    },
    (error)=>{
  this.toastr.error("Unable to load the messages.");
    });
  }
  sendMessages(){
    this.newMessage.recipientId=this.memberId;
    return this.memberService.createMessage(this.auth.decodeToken.id,this.newMessage).subscribe(message=>{
      this.messages.push(message);
      this.newMessage='';
          },(error)=>{
            this.toastr.error("Unable to send the message");
          })
  }
}
