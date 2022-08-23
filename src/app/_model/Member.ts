import { Photo } from './Photo';
export interface Member {
  id:string;
  email:string;
  password:string;
  confirmPassword:string;
  userName:string;
  phoneNumber:string;
  gender:string;
  age:number;
  knownAs:string;
  created:Date;
  photoUrl:string;
  lastActive:Date;
  graduationYear:Date;
  city:string;
  country:string;
  introduction?:string;
  lookingFor?:string;
  Photo?:Photo[];
  token:string;
  roles:string[];
}
