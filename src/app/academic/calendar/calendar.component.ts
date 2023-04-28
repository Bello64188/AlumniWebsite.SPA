import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocumentService } from 'src/app/_services/document.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  constructor( private docService: DocumentService,private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
  }
  getDocumentName(){
    this.SpinnerService.show();
    this.docService.GetDocumentName().subscribe((data:any)=>{
      var sampleArr = this.base64ToArrayBuffer(data.path)
      this.saveBtyeArray('Calendar', sampleArr);
      this.SpinnerService.hide();

    })
  }
   base64ToArrayBuffer(base64:any) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}
 saveBtyeArray(reportName:any, byte:any) {
  var blob = new Blob([byte], { type: "application/pdf" });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  var fileName = reportName;
  link.download = fileName;
  link.click();
}
}
