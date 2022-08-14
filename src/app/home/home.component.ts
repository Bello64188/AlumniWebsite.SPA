import { Component, OnInit } from '@angular/core';
import { faBook , faMagnifyingGlassChart,faPeopleGroup, faArrowsDownToLine, faUsers,faEarthAfrica,faHandHoldingHeart,faGlobe} from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
book=faBook;
search= faMagnifyingGlassChart;
people=faPeopleGroup;
arrow= faArrowsDownToLine;
user=faUsers;
earth=faEarthAfrica;
hand=faHandHoldingHeart;
africa= faGlobe;
  constructor() { }

  ngOnInit(): void {
  }

}
