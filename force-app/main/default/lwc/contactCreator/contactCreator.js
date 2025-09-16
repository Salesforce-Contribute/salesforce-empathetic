import { LightningElement } from 'lwc';
import { showToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRSTNAME from '@salesforce/schema/Contact.FirstName';
import LASTNAME from '@salesforce/schema/Contact.LastName';
import EMAIL from '@salesforce/schema/Contact.Email';

export default class ContactCreator extends LightningElement {

    objectApiName = CONTACT_OBJECT;
    fields = [FIRSTNAME, LASTNAME, EMAIL];

    handleSuccess(event){
        const toastEvent = new showToastEvent({
            message:"RecordID" + event.detail.id,
            variant:"success"
        });
        this.dispatchEvent(toastEvent)
    }

}