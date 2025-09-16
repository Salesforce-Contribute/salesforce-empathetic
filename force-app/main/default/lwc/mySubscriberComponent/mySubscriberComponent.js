import { LightningElement, track, wire } from 'lwc';
import { APPLICATION_SCOPE, MessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import messageChannel from '@salesforce/messageChannel/messageService__c'
import getContactList from '@salesforce/apex/DatatableController.getContacts';

export default class MySubscriberComponent extends LightningElement {

    
    subscription = null;
    @track receivedMessage;

    @wire(getContactList, { recordId: '$recordId' })
    wiredRecord({ error, data }) {
        if (error) {
            console.log('error: ' + JSON.stringify(error));
        } else if (data) {
            this.receivedMessage = data
            console.log('recievedMessage: '+ JSON.stringify(data));
        }
    }

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeMessageChannel();
    }

    subscribeMessageChannel() {
        if(this.subscription) {
            return;
        }
        this.subscription = subscribe(this.messageContext, messageChannel, (message)=>{
            this.receivedMessage = message ? JSON.stringify(message, null, '\t') : 'no message payload';
        },{ scope: APPLICATION_SCOPE })
    }

    unSubscribeMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

}