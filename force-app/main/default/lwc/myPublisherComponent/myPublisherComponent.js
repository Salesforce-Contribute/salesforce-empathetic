import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/DatatableController.getContacts';

// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import messageChannel from '@salesforce/messageChannel/messageService__c'

export default class MyPublisherComponent extends LightningElement {
    @wire(getContactList)
    contacts;

    @wire(MessageContext)
    messageContext;

    // Respond to UI event by publishing message
    publicMessageService(event) {
        const payload = { recordId: event.target.dataset.contactId };
        console.log('LWC payload: '+ JSON.stringify(payload));
        publish(this.messageContext, messageChannel, payload);
    }
}