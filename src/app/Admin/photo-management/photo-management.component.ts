import { ToastrService } from 'ngx-toastr';
import { AdminService } from './../../_services/admin.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
photos:any[]=[];
constructor(private adminservice:AdminService, private toastr:ToastrService,
    private SpinnerService: NgxSpinnerService ){}
  ngOnInit(): void {
    this.getUnapprovedPhoto();
  }

getUnapprovedPhoto(){
  this.SpinnerService.show();
 return this.adminservice.getUnApprovedPhoto().subscribe((next:any)=>{
this.photos=next
this.SpinnerService.hide();
 });
}
approvePhoto(id:number){
  this.SpinnerService.show();
  return this.adminservice.approvePhoto(id).subscribe(()=>{
    this.photos.slice(this.photos.findIndex(p=>p.id===id),1);
    this.toastr.success("Photo approved successfully");
    this.SpinnerService.hide();
  })
}
rejectPhoto(id:number){
  this.SpinnerService.show();
  return this.adminservice.rejectPhoto(id).subscribe(()=>{
    this.photos.slice(this.photos.findIndex(x=>x.id===id),1);
    this.toastr.success("Photo rejected successfully");
    this.getUnapprovedPhoto();
    this.SpinnerService.hide();
  });
}
}
