import { Router } from '@angular/router';
import { AlertifyService } from './../../_services/alertify.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../_services/auth.service';
import { MemberService } from './../../_services/member.service';
import { Photo } from './../../_model/Photo';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
@Input() photos:Photo[];
uploader:FileUploader;
hasBaseDropZoneOver:false;
hasAnotherDropZoneOver:false;
BaseUrl=environment.MemberApi;
currrentPhoto:Photo;

@Output() getMemberPhoto = new EventEmitter<string>();
  constructor(private membService: MemberService,
    private auth: AuthService,
    private toastr: ToastrService,
    private route:Router) { }

  ngOnInit(): void {
    this.initialUploader();
  }
public  fileOverBase(e:any):void{
  this.hasBaseDropZoneOver=e;
}
initialUploader(){
  this.uploader = new FileUploader({
    url:this.BaseUrl+ 'members/'+ this.auth.decodeToken.id+ '/photo',
    authToken: 'Bearer ' + localStorage.getItem('token'),
    isHTML5:true,
    autoUpload:false,
    allowedFileType:['image'],
    removeAfterUpload:true,
    maxFileSize: 3*1024*1024,
    headers:[
      {
        name:'X-Requested-with',
        value:'XMLHttpRequest'
      }

    ]
  });
  this.uploader.onAfterAddingFile = (file)=>{file.withCredentials=true};
  this.uploader.onSuccessItem=(item,response,status,headers)=>{

    if(response){
      const res:Photo=JSON.parse(response);
      console.log(res);

      const photo ={
        id:res.id,
        url:res.url,
        dateAdded:res.dateAdded,
        description:res.description,
        isMain:res.isMain
      }
      this.photos.push(photo);
      if(photo.isMain){
        this.auth.changeMemberPhoto(photo.url);
        this.auth.currentUser.photoUrl=photo.url;
        localStorage.setItem('memberFromDto',JSON.stringify(this.auth.currentUser));
      }
    }
  }
}
    setMainPhoto(photo:Photo){
      return this.membService.setMainPhoto(this.auth.decodeToken.id,photo.id)
      .subscribe(()=>{
        this.currrentPhoto = this.photos.filter(p=>p.isMain==true)[0];
        this.currrentPhoto.isMain=false; // set current photo to false
        photo.isMain=true;//set selected photo as main
        this.auth.changeMemberPhoto(photo.url);
        this.auth.currentUser.photoUrl = photo.url;
        localStorage.setItem('memberFromDto',JSON.stringify(this.auth.currentUser));
      },
      (error=>{
        this.toastr.error('Unable to set the Photo to Main');
      })
      )
    }

    deletePhoto(id:number){

      Swal.fire({
        title:'About to delete photo are you sure?',
        showDenyButton:true,
        showCancelButton:true,
        confirmButtonText:'Delete',
        denyButtonText:`Don't delete`
      }).then((result):any=>{
          if(result.isConfirmed){
            return this.membService.deletePhoto(this.auth.decodeToken.id,id)
            .subscribe(()=>{
            this.photos.splice(this.photos.findIndex(p=>p.id==id),1);
            Swal.fire('Delete!', '', 'success');
            },
            (error)=>{
            this.toastr.error("Failed to delete the photo");
            },
            // ()=>{
            // this.route.navigateByUrl('/members/'+ this.auth.decodeToken.id);
            // }
            );
          }else if(result.isDenied){
            Swal.fire('Delete Cancel', '', 'info');
          }
      })
    }
}

