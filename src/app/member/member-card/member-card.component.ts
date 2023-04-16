import { AuthService } from './../../_services/auth.service';
import { MemberService } from 'src/app/_services/member.service';
import { Member } from './../../_model/Member';
import { Component, OnInit ,Input} from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
photoUrl:string;
  constructor(private memberserive:MemberService,
    private toastr:ToastrService,
    private auth:AuthService) { }
@Input() member:Member;
  ngOnInit(): void {
  }
sendLike(id:string){
this.memberserive.sendLike(this.auth.decodeToken.id,id)
.subscribe(()=>{
  this.toastr.success("you have Like: " + this.member.knownAs);
},
(error)=>{
  this.toastr.error("Have you add member before? please check.");
})
}
}
