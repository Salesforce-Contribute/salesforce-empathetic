import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/DatatableController.getContactList';

// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import messageChannel from '@salesforce/messageChannel/demoMessage__c';

export default class PublisherComponent extends LightningElement {
    @wire(getContactList)
    contacts;

    @wire(MessageContext)
    messageContext;

    // Respond to UI event by publishing message
    publicMessageService(event) {
        const payload = { recordId: event.target.dataset.contactId, recordData:'Test demo' };
        console.log('LWC payload: '+ JSON.stringify(payload));
        publish(this.messageContext, messageChannel, payload);
    }
}