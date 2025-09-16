import { LightningElement, api } from 'lwc';

export default class Childnumerator extends LightningElement {
    @api childpropertycounter = 0;

    @api
    maximizeCounter() {
      this.childpropertycounter += 10;
    }
}