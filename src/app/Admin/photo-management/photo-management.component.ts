import { ToastrService } from 'ngx-toastr';
import { AdminService } from './../../_services/admin.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
photos:any[]=[];
constructor(private adminservice:AdminService, private toastr:ToastrService){}
  ngOnInit(): void {
    this.getUnapprovedPhoto();
  }

getUnapprovedPhoto(){
 return this.adminservice.getUnApprovedPhoto().subscribe((next:any)=>{
this.photos=next
 });
}
approvePhoto(id:number){
  return this.adminservice.approvePhoto(id).subscribe(()=>{
    this.photos.slice(this.photos.findIndex(p=>p.id===id),1);
    this.toastr.success("Photo Approved Successfully");
  })
}
rejectPhoto(id:number){
  return this.adminservice.rejectPhoto(id).subscribe(()=>{
    this.photos.slice(this.photos.findIndex(x=>x.id===id),1);
    this.toastr.success("Photo Rejected Successfully");
    this.getUnapprovedPhoto();
  });
}
}
