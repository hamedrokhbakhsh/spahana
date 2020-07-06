import {Pipe, PipeTransform} from '@angular/core';
import {appconfig} from '../appconfig';

@Pipe({
  name: 'baseUrl',
})
export class BaseUrl implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    if(value){
      return `${appconfig.image}/${value}`;
    }
    return null;
  }
}
