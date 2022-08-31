import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../_services/auth.service';
import { Member } from './../../_model/Member';
import { Component, OnInit } from '@angular/core';
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
  constructor(private auth:AuthService,private toastr:ToastrService,private route:ActivatedRoute) { }

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
}
