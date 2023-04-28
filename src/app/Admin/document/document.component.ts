import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/_services/document.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})
export class DocumentComponent implements OnInit {
  constructor(
    private docService: DocumentService,
    private toastr: ToastrService,private SpinnerService: NgxSpinnerService
  ) {}
  ngOnInit(): void {}
  docfile = new FormGroup({
    file: new FormControl('', Validators.required),
    fileSource: new FormControl('', Validators.required),
  });
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.docfile.patchValue({
        fileSource: file,
      });
    }
  }
  get f() {
    return this.docfile.controls;
  }
  UploadDocument() {

    this.SpinnerService.show();
   let file = this.docfile.get('fileSource')?.value??"";
    var formData = new FormData();
    formData.append('file', file);

    this.docService.UploadDocument(formData).subscribe(
      () => {
        this.toastr.success('Document uploaded successfully.');
        this.SpinnerService.hide();
      },
      (error) => {
        this.toastr.error('Document upload failed');
        this.SpinnerService.hide();
      }
    );
    this.docfile.reset();
  }
  DeleteDocument(form: NgForm) {
    this.SpinnerService.show();
    let docName = form.value.DocumentName;
    this.docService.DeleteDocument(docName).subscribe(()=>{
      this.toastr.success('Document deleted successfully.');
      this.SpinnerService.hide();
    },()=>{
      this.toastr.error('Unable to delete document');
      this.SpinnerService.hide();
    })
    form.resetForm();
  }

}
