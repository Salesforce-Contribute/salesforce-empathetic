import { LightningElement, api, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { refreshApex } from '@salesforce/apex';
import {subscribe,unsubscribe,onError,setDebugFlag,isEmpEnabled,} from 'lightning/empApi';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import refreshContact from '@salesforce/apex/PushTopicOnContact.refreshContact'

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResult extends LightningElement {

    @api selectedBoatId;

    channelName = '/topic/ContactUpdates';

    columns = [
        { label: 'Name', fieldName: 'Name', editable: true },
        { label: 'Length', fieldName: 'Length__c', type: 'number'},
        { label: 'Price', fieldName: 'Price__c', type: 'currency'},
        { label: 'Description', fieldName: 'Description__c'}, 
        { label: 'ContacName', fieldName: 'Contact__r'},        
    ];

    boatTypeId = '';
    
    @track
    boats;
    isLoading = false;
    
    @track
    draftValues = [];

    boatData;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        refreshContact()
        .then((res)=>{
            console.log('success');
        })
        .catch((error)=>{
            console.log('pushtopic error');
        })
        
        onError((error) => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }

    @wire(getBoats, {boatTypeId:'$boatTypeId'})
    wiredBoats({data, error}){
        this.boatData = data;
        if(data){
            this.boats = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.accounts = undefined;
        }
    }

    @api
    searchBoatResult(boatTypeId){
        console.log('-----searchBoatResult----')
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.boatTypeId = boatTypeId;
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    @api
    async refresh() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        let x = await refreshApex(this.boatData);
        // console.log('x: '+ x);
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    updateSelectedTile(event) {
        this.selectedBoatId = event.detail.boatId;
        console.log('updateSelecteTile: '+ this.selectedBoatId);
        this.sendMessageService(this.selectedBoatId);
    }
    
    sendMessageService(boatId) { 
        //explicitly pass boatId to the parameter recordId
        publish(this.messageContext, BOATMC, { recordId: boatId });
    }

    handleSave(event) {
        const updateFields = event.detail.draftValues;
        updateBoatList({data:updateFields})
        .then(result => {
            // console.log(result)
            const toast = new ShowToastEvent({
                title: SUCCESS_TITLE,
                message: MESSAGE_SHIP_IT,
                variant: SUCCESS_VARIANT,
            })
            this.dispatchEvent(toast);
            this.draftValues = [];
            //return this.refresh();
            this.handleSubscribe();
        })
        .catch(error => {
            const toast = new ShowToastEvent({
                title: ERROR_TITLE,
                message: error.message,
                variant: ERROR_VARIANT,
            });
            this.dispatchEvent(toast);
        })
        .finally(() => {})
    }

    notifyLoading(isLoading){
        if(isLoading){
            console.log('-----load notifyLoading----')
            const load = new CustomEvent('loading');
            this.dispatchEvent(load);
        } else {
            console.log('-----done notifyLoading----')
            const unload = new CustomEvent('doneloading');
            this.dispatchEvent(unload);
        }
    }


    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const messageCallback = function (response) {
            console.log('New message received: ', JSON.stringify(response));
            // Response contains the payload of the new message received
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then((response) => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ',JSON.stringify(response));
        });
    }
}