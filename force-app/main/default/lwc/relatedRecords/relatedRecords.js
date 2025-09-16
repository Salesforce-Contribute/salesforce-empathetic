import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/RelatedRecordController.getAccounts'
import getContacts from '@salesforce/apex/RelatedRecordController.getContacts'
import fetchRelatedData from '@salesforce/apex/RelatedRecordController.fetchRelatedData'

export default class RelatedRecords extends LightningElement {

    @track accounts = [];
    @track contacts = [];

    wiredAccount;
    @wire(getAccounts)
    wiredAccounts(value){
        this.wiredAccount = value;
        const {data, error} = value;
        if(data) {
            this.accounts = data;
        } else if(error){
            console.log('Account error: '+ error);
        }
    }

    wiredContact;
    @wire(getContacts)
    wiredContacts(value){
        this.wiredContact = value;
        const {data, error} = value;
        if(data){
            this.contacts = data;
        } else if(error) {
            console.log('Contact error: '+ error);
        }

    }

    showRelateContact(event) {
        const accountId = event.target.value;
        console.log('AccountId: '+ accountId);
        fetchRelatedData({accId:accountId})
        .then(response=>{
            console.log('response: '+ response);
        })
        .catch(error=>{
            console.log('error: '+ error.body.message);
        })
    }


}