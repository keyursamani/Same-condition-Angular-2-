import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'AbbrevDate'
})
export class AbbrevDatePipe implements PipeTransform {

  transform(originStr: string): string {
    let splitStrList = originStr.split(" ");    
    return splitStrList[0].substr(0,3) + " " +  splitStrList[1] + " " + splitStrList[2];
  }
}
