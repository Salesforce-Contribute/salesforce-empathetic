import { LightningElement } from 'lwc';
import getAccountForLogger from '@salesforce/apex/PaginationController.getAccountForLogger';
import { log } from 'lightning/logger';

export default class ExampleComponent extends LightningElement {

  handleLog() {
    getAccountForLogger()
    .then((res)=>{
      log(res);
    })
    .catch((error)=>{
      log(error)
    })
  }
}