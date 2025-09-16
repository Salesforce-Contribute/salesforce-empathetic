import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import empapi from '@salesforce/apex/EmpApiController.empapi'
// import AccountUpdatedEvent from '@salesforce/apex/EmpApiController.AccountUpdatedEvent'
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import { createRecord } from 'lightning/uiRecordApi';
// import RECORDID from '@salesforce/schema/Account_Updated__e.RecordId__c';
// import CHANGETYPE from '@salesforce/schema/Account_Updated__e.Change_Type__c'
// import ACCOUNT_EVENT_OBJECT from '@salesforce/schema/Account_Updated__c';


export default class EmpApi extends LightningElement {

    channelName = "/event/Contact__e";
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;
    subscription = {};
    result="";

    @track responseData = [];
    @track recievedData = [];


    get labels() {
        return !this.isSubscribeDisabled ? 'Subscribe': 'Unsubscribe';
    }

    get variants(){
        return !this.isSubscribeDisabled ? 'success': 'destructive';
    }

    // Initializes the component
    connectedCallback() {
        if(!isEmpEnabled){
            console.log("Don't support EMP");
        }
        // Register error listener
        //this.registerErrorListener();
        
    }

    handleChannelName(event) {
        this.channelName = event.target.value;
        console.log('channel name; '+ this.channelName);
        //{"name": "John Doe", "age": 30}
        /*let eventPolicy = event.target.value;
        console.log('1'+ eventPolicy);*/
    }

    handleSubscription() {
        if(!this.isSubscribeDisabled) {
            this.handleSubscribe();
        } 
        if(!this.isUnsubscribeDisabled) {
            this.handleUnsubscribe();
        }
    }

    // Handles subscribe button click
    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const messageCallback = (response) => {
            // Response contains the payload of the new message received
            // console.log('new message recieved: '+ JSON.stringify(response));
            //this.responseData.push(response);
            this.recievedData.unshift(JSON.stringify(response, null, '\t'));
            // console.log('responseData: '+ JSON.stringify(this.responseData));
            //this.result = JSON.stringify(this.responseData, null, '\t');

            //for(let i=0; i<this.responseData.length; i++) {
             //   this.recievedData.unshift(JSON.stringify(this.responseData[i]));
            //}

            // for(let i=0; i<this.responseData.length; i++) {
            //     this.recievedData.unshift(JSON.parse(JSON.stringify(this.responseData[i])));
            // }
            console.log(JSON.stringify(this.recievedData));

        }

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback)
        .then((response)=>{
             // Response contains the subscription information on subscribe call
             console.log(JSON.stringify(response));
             this.subscription = response;
             this.toggleSubscribeButton(true);
             this.showToast('Success', `Subscription request send to ${response.channel}`, 'info');
        })
    }

    // Handles unsubscribe button click
    handleUnsubscribe() {
        this.toggleSubscribeButton(false);

        // Invoke unsubscribe method of empApi
        unsubscribe(this.subscription, (response)=> {
            console.log('unsubscribe: => '+ JSON.stringify(response));
            this.result = JSON.stringify(response, null, '\t');
        })
    }

    toggleSubscribeButton(enableSubscribe) {
        this.isSubscribeDisabled = enableSubscribe;
        this.isUnsubscribeDisabled = !enableSubscribe;
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log('EmpApi - Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }

    handlePublish() {
        //Apex method
        empapi({msg:'Hello emp api'})
        .then((res) => {
            this.showToast('Success', 'Data published', 'success');
        })
        .catch((error) => {
            console.log(`Error: ${error.body.message}`)
        })

        /*const fields = {};
        // fields[RECORDID.fieldApiName] = '0012w00001R6qgpAAB';
        // fields[CHANGETYPE.fieldApiName] = 'Insert';
        fields.RecordId__c= '0012w00001R6qgpAAB';
        fields.Change_Type__c = 'Insert';
        const recordInput = { apiName: ACCOUNT_EVENT_OBJECT.objectApiName, fields};
        console.log('recordInput: '+ JSON.stringify(recordInput));
        createRecord(recordInput)
        .then(response => {
            console.log('Event published successfully');
        })
        .catch(error => {
            console.error('Error publishing event:', error);
        });*/
    }

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }
}