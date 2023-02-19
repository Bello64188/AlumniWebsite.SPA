import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(list: any[], value:any,fieldName:string): any[] {

   // return empty array if array is falsy
   if (!list) { return []; }

   // return the original array if search text is empty
   if (!value) { return list; }
   if(value.includes('@')){return list;}

   // convert the searchText to lower case
   value = value.toLowerCase();

   // retrun the filtered array
   return list.filter(item => {
     if (item && item[fieldName]) {
       return item[fieldName].toLowerCase().includes(value);
     }
     return false;
   });
  }

}
