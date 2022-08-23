import { AuthService } from './../../_services/auth.service';
import { Component, OnInit , Inject} from '@angular/core';

@Component({
  selector: 'app-weatherforecast',
  templateUrl: './weatherforecast.component.html',
  styleUrls: ['./weatherforecast.component.css']
})
export class WeatherforecastComponent implements OnInit {
data:any[]=[];
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    //this.get()
  }
// get(){
//   return this.auth.getWeather().subscribe(data=>{
//    console.log(data);
//    this.data =data;
//   },error=>{
//     console.log(error);

//   })
// }
}
