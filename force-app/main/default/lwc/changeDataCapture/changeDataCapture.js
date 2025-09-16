import { LightningElement, api, wire, track } from 'lwc';
import { subscribe, unsubscribe, onError} from 'lightning/empApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getEmployees from '@salesforce/apex/ChangeDataCaptureController.getEmployees';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'FirstName', fieldName: 'First_Name__c'},
    { label: 'LastName', fieldName: 'Last_Name__c'},
    { label: 'Tenure', fieldName: 'Tenure__c'}
]
export default class ChangeDataCapture extends LightningElement {
    
    @api recordId;
    columns = COLUMNS;
    @track employeeData;
    @api channelName = '/data/Employee__ChangeEvent';
    subscription = {};

    connectedCallback() {
        //this.registerErrorListener();
        this.handleSubscribe();
    }

    employeesActivity;
    @wire(getEmployees)
    wiredGetEmployees(value){
        this.employeesActivity = value;
        const {data, error} = value;
        console.log('Wired run.....')
        if(data) {
            this.employeeData = data;
        } else if(error) {
            this.toastMessage("Error", error.body.message, "error");
        }
    }

    handleSubscribe() {
        const messageCallback = (response) => {
            console.log('New message received: ');
            this.handleCaptureDataChange(response);
        };

        subscribe(this.channelName, -1, messageCallback).then((response) => {
            console.log('Subscription request sent to: ',JSON.stringify(response.channel));
            this.subscription = response;
        });
    }

    handleUnsubscribe() {
        unsubscribe(this.subscription, (response) => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
        });
    }

    handleCaptureDataChange(response) {
        console.log('----handleCaptureDataChange----');
        if(response.hasOwnProperty("data")){
            if(response.data.hasOwnProperty("payload")){
                const payload = response.data.payload;
                if(payload.ChangeEventHeader.changeType == 'UPDATE'){
                    refreshApex(this.employeesActivity);
                    this.toastMessage("Success", "Record is updated", "success");
                }
                /*const isRecordExist = payload.ChangeEventHeader.recordIds.find((ids) => ids == this.recordId);
                if(isRecordExist != undefined) {  
                    this.recordId = payload.ChangeEventHeader.recordIds[0]; 
                    this.refreshPage();
                }*/
                console.log(`${response.data.payload.Name}, ${response.data.payload.First_Name__c}, ${response.data.payload.Last_Name__c}, ${response.data.payload.Tenure__c}`);
                
            }
        }
    }    

    async refreshPage() {
        console.log('recoredId : '+ this.recordId);
        const res = await notifyRecordUpdateAvailable([{recordId:this.recordId}]);
        console.log('notify response: '+ res);
        if(res){
            this.toastMessage("Success", "Record is updated", "success");
        }
    }
    
    registerErrorListener() {
        onError((errors) => {
            console.log('Change Data Capture -Received error from server: ', JSON.stringify(errors));
            this.toastMessage("Error", errors.error, "error");
        });
    }

    toastMessage(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
              title: title,
              message: message,
              variant: variant,
              mode: 'dismissible'
            }),
        );
    }
    
    disconnectedCallback() {
        this.handleUnsubscribe();
    }

}