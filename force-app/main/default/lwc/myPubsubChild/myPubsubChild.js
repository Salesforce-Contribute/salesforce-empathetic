import { LightningElement, wire } from 'lwc';
import { registerListener } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class MyPubsubChild extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    viewMsg;

    connectedCallback() {
        registerListener('inputVal', this.subscribed, this);
    }

    subscribed(message) {
        this.viewMsg = message;
    }
}