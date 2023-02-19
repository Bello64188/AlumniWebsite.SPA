import { MemberService } from 'src/app/_services/member.service';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../_services/auth.service';
import { Member } from './../../_model/Member';
import { Component, OnInit,ViewChild } from '@angular/core';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
members:any;
photoUrl:string;
galleryOptions:NgxGalleryOptions[];
galleryImages:NgxGalleryImage[];
@ViewChild('memberTabs',{static:false}) memberTabs:MatTabGroup;
@ViewChild('tab',{static:true}) queryTab:MatTabGroup;
change:MatTabGroup;
  constructor(private auth:AuthService,private toastr:ToastrService,private route:ActivatedRoute, private memberService:MemberService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data=>{
      this.members= data['members'];
    });
//* subscribed to behaviorSubject for photoUrl
this.auth.currentPhotoUrl.subscribe(photourl=>this.photoUrl=photourl);
//* setting properties for gallery
this.galleryOptions=[{
  width:'500px',
  height:'500px',
  thumbnailsColumns:4,
  imagePercent:100,
  imageAnimation:NgxGalleryAnimation.Slide,
  preview:false
 }];
 this.galleryImages= this.getImage();
  this.getTab();
  }

getImage(){
  const imageUrls=[];
  for (let i = 0; i < this.members.photos.length; i++) {
  imageUrls.push({
      small: this.members.photos[i].url,
      medium: this.members.photos[i].url,
      big:this.members.photos[i].url,
      description:this.members.photos[i].description
  });

  }
return imageUrls;
}
tabChanged(){
  const tabGroup = this.memberTabs;
  if(!tabGroup||!(tabGroup instanceof MatTabGroup))return;
  tabGroup.selectedIndex=3;
}
getTab(){
  let tabs:any;
  this.route.queryParamMap.subscribe(params=>{
 tabs= params.get('tab');
  })
  const tabGroup = this.queryTab;
  if(!tabGroup||!(tabGroup instanceof MatTabGroup))return;
  tabGroup.selectedIndex=tabs;

}

sendLike(id:string){
  this.memberService.sendLike(this.auth.decodeToken.id,id)
  .subscribe(()=>{
    this.toastr.success("you have Like: " + this.members.knownAs);
  },
  (error)=>{
    this.toastr.error("Have you add Member before? Please Check.");
  })
  }
}
