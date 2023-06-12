import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: string): string {
    value = value.toUpperCase();
    if(value === 'MALE') {
      return 'Homme';
    } else if(value === 'FEMALE') {
      return 'Femme';
    }

    return value;
  }

}
