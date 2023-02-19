import { Message } from 'src/app/_model/Message';
import { Member } from './../_model/Member';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../_model/Pagination';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
BaseUrl = environment.MemberApi;
  constructor(private http:HttpClient) { }
//* get members method
getMembers(page?:number,itemsPerPage?:number,memberParams?:any,likeParams?:any):
Observable<PaginatedResult<any[]>>{
const paginatedResult:PaginatedResult<any>= new PaginatedResult<any>();
let params = new HttpParams();
//* check if there is pagesize and pagenumber params
if(page != null && itemsPerPage != null){
  params = params.append('pageNumber',page);
  params = params.append('pageSize',itemsPerPage);
}
//*check if there is gender,graduationYear and orderBy params
if (memberParams != null) {
  params = params.append('graduationYear',memberParams.graduationYear);
  params = params.append('gender',memberParams.gender);
  params = params.append('orderBy',memberParams.orderBy);
}
if(likeParams==='Likers'){
  params=params.append('Likers',true);
}
if (likeParams ==='Likees') {
  params =params.append('Likees',true);
}

return this.http.get(this.BaseUrl +'members',{observe:'response', params}).
pipe(map((response:HttpResponse<any>)=>{
  paginatedResult.result= response.body;
  if(response.headers.get("x-Pagination") !== null)
  paginatedResult.pagination = JSON.parse(response.headers.get("x-Pagination") || '{}');
  return paginatedResult;
}));

}
// send like method
sendLike(memberid:string,recipientid:string){
return this.http.post(this.BaseUrl+ 'members/' + memberid +'/like/' +recipientid,{});
}
//* get member details

getMember(id:any):Observable<any>{
  return this.http.get(this.BaseUrl+'members/'+id);
}
 //* Password Validation method
  patternValidation(): ValidatorFn{
    return (control:AbstractControl):{[key:string]:any}=>{
      if(!control.value){
         return null as any;
      }
       const regex = new RegExp('^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=.*?[#?!@$%^&*-]).{4,15}$')
     const valid = regex.test(control.value);
     return valid ? null as any : {invalidPassword:true};
    };
  }
  // update member
updateMember(id:any,member:Member) :Observable<any> {
return this.http.put(this.BaseUrl +'members/'+id,member);
 }
// set main photo for user
setMainPhoto(memberId:any,id:any):Observable<any>{
  return this.http.post(this.BaseUrl + 'members/' +memberId +'/photo/'+ id + '/setMain',{});
}
// delete member photo
deletePhoto(memberId:any,id:any):Observable<any>{
  return this.http.delete(this.BaseUrl + 'members/' + memberId + '/photo/' + id);
}

getMessages(memberId:any,page?:number,itemsPerPage?:number,messageContainer?:string):Observable<PaginatedResult<any[]>>{
const paginatedResult :PaginatedResult<any> = new PaginatedResult<any>();
let params = new HttpParams();
params =params.append('MessageContainer',messageContainer|| '{}');
if (page != null && itemsPerPage != null) {
  params =params.append('pageNumber',page);
  params =params.append('pageSize',itemsPerPage);
}
return this.http.get(this.BaseUrl +'members/'+ memberId +'/message', {observe:'response',params:params})
.pipe(
  map(response=>{
    console.log(response.body);
    paginatedResult.result = response.body
    if(response.headers.get('x-Pagination') != null)
    {
      paginatedResult.pagination= JSON.parse(response.headers.get('x-Pagination') || '{}');
    }
    return paginatedResult;
  })
);
}
getMessageThread(memberId: string,recipientId:string):Observable<any>{
return this.http.get(this.BaseUrl +'members/' + memberId+ '/message/thread/'+ recipientId);
}

createMessage(memberId:string, message:Message){
return this.http.post(this.BaseUrl + 'members/'+ memberId + '/message',message);
}
deleteMessage(id:number,memberId:string){
  return this.http.post(this.BaseUrl + 'members/'+ memberId + '/message/' +id,{});
}
markAsRead(memberId:string, messageId:number){
  this.http.post(this.BaseUrl + 'members/'+ memberId + '/message/' + messageId + '/read',{}).subscribe();
}
}

