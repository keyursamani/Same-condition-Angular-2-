import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
  name: 'keys',
  pure: false
})

export class KeysPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    if (!value) { return; }
    return (<any>Object).keys(value);
  }
}

@Pipe({
  name: 'values',
  pure: false
})

export class ValuesPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    if (!value) { return; }
    return (<any>Object).values(value);
  }
}
