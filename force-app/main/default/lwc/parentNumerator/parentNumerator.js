import { LightningElement } from 'lwc';

export default class ParentNumerator extends LightningElement {

    counter = 0;

    handleIncrement() {
        this.counter++;
    }

    handleDecrement() {
        this.counter--;
    }

    handleMultiply(event) {
        const factor = event.detail;
        this.counter *= factor
    }
}