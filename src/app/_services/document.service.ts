import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  docUrl = environment.DocumentUrl;

  constructor(private Http: HttpClient) {}
  UploadDocument(form:any) {
    return this.Http.post(this.docUrl + 'UploadDocument', form);
  }
  DeleteDocument(docName:string){
    return this.Http.delete(this.docUrl + 'DeleteDocument/'+docName);
  }
  GetDocumentName(){
    return this.Http.get(this.docUrl + 'GetDocumentName');
  }
}
