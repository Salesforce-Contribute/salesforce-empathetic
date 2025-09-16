import { LightningElement, api, track, wire } from 'lwc';
import getAccountsForPushTopic from '@salesforce/apex/DatatableController.getAccountsForPushTopic'
import { subscribe, unsubscribe, onError} from 'lightning/empApi';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class PushTopicStreamingApi extends NavigationMixin(LightningElement) {

    @track accountData;
    @api recordId;
      
    connectedCallback() {
        // this.registerErrorListener();
        this.handleSubscribe();
    }

    accountsActivity;
    @wire(getAccountsForPushTopic)
    wiredGetAccounts(value){
        this.accountsActivity = value;
        const {data, error} = value;
        if(data) {
            this.accountData = data;
        } else if(error) {
            console.log('Error getAccountsForPushTopic:'+ error);
        }
    }

    channelName = '/topic/ContactUpdates'; //You have delete this chanel event. Please new
    subscription = {};

    // Handles subscribe
    handleSubscribe() {
        const messageCallback = (response) => {
            this.handleChangeEventResponse(response);
        }

        subscribe(this.channelName, -1, messageCallback)
        .then((response) => {
            console.log('Subscription request sent to: ',JSON.stringify(response.channel));
            this.subscription = response;
        });
    }

    editAccount(event) {
        event.preventDefault();
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.accId,
                objectApiName: 'Account',
                actionName: 'edit'
            },
        });
    }

    handleChangeEventResponse(response) {
        console.log('-----handleChangeEventResponse-------');
        console.log('New message recieved: '+ JSON.stringify(response));
        if(response.data.event.type=="updated") {
            return refreshApex(this.accountsActivity);
        }
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((errors) => {
            console.log('PushTopic Received error from server: ', errors.error);
            this.toastMessage("Error", errors.error, "error");
        });
    }

    disconnectedCallback() {
        unsubscribe(this.subscription, (response) => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
        });
    }

    toastMessage(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
              title: title,
              message: message,
              variant: variant,
            }),
        );
    }
}

/*{
                "advice": {
                  "interval": 0,
                  "reconnect": "handshake"
                },
                "channel": "/meta/connect",
                "id": "11",
                "error": "403::Unknown client",
                "successful": false
              }
            {
                "clientId": "4xg15eeny70m2bbfjbxps2fqlt00",
                "channel": "/meta/subscribe",
                "id": "7",
                "subscription": "/topic/AccountUpdates",
                "error": "400::The channel you requested to subscribe to does not exist {/topic/AccountUpdates}",
                "successful": false
              }*/