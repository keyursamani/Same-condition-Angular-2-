import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'wholeNumber'
})
export class WholeNumberPipe implements PipeTransform {

  transform(floatvalue: string): string {      
    return parseInt(floatvalue).toString();
  }
}
