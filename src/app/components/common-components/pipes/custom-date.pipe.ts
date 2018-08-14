import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(originStr: string): string {
    let splitStrList = originStr.split(" ");    
    return splitStrList[0] + " " +  splitStrList[1] + ", " + splitStrList[2];
  }
}
