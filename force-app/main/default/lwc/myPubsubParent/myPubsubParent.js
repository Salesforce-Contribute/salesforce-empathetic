import { LightningElement, wire, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { copyToClipboard } from 'c/copyToClipBoard';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class MyPubsubParent extends LightningElement {

    @wire(CurrentPageReference) pageRef;
    val;

    @api objectApiName;
    connectedCallback() {
        //console.log('ObjectAPiName: '+ this.objectApiName);
        this.val='Default value;';
    }

    inputHandler(event) {
        this.val = event.target.value;
        fireEvent(this.pageRef, 'inputVal', this.val);
    }

    // Handler for copying the URL to clipboard
    handleCopy() {
        copyToClipboard(this.val);
        this.showToast("Success", "Copied Successfully", "success");
    }

    // Show a toast message
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}