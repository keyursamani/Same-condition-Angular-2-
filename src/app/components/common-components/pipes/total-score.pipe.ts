import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'totalScore'
})
export class TotalScorePipe implements PipeTransform {

  transform(originValue: string): string {        
    let numberValue = parseFloat(originValue);
    let newValue: any;
    if (numberValue <= 50 ){
        newValue = originValue + " (Low)";
    } else if ( 50 < numberValue) {
        newValue = originValue + " (High)";
    }    
    return newValue;
  }
}
