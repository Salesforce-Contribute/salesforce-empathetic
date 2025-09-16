import { LightningElement, wire, api, track} from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
import FIRSTNAME from '@salesforce/schema/Contact.FirstName'
import LASTNAME from '@salesforce/schema/Contact.LastName'
import EMAIL from '@salesforce/schema/Contact.Email'
import getContacts from '@salesforce/apex/ContactController.getContacts'
import getContactListWired from '@salesforce/apex/DatatableController.getContactListWired';
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import ACCOUNTID_FIELD from "@salesforce/schema/Contact.AccountId";
import { getLayout } from "lightning/uiLayoutApi";

const COLUMNS = [
    {label:'FirstName', fieldName:FIRSTNAME.fieldApiName, type:'text'},
    {label:'LastName', fieldName:LASTNAME.fieldApiName, type:'text'},
    {label:'Email', fieldName:EMAIL.fieldApiName, type:'text'}
]

export default class ContactList extends LightningElement {

    @api recordId;
    @track contactData;
    demoData;

    // columns = COLUMNS;
    // @wire(getContacts)
    // contacts;

    // get errors() {
    //     return (this.accounts.error) ?
    //         reduceErrors(this.accounts.error) : [];
    // }


    /*@wire(getDemographicIdByClient, { caseId: '$recordId'})
    wiredBatchData(value) {
        this.wiredData = value;
        const { data, error } = value;
        if(data) {
            console.log('data[0] >> ', data[0]);
            this.demoData = data[0].Id
            if(this.demoData.length > 0){
                this.hasDemoData = true;
            }
        } else if (error){
            console.log(error);
        }
    }*/

    

    @wire(getLayout, { objectApiName: 'Account', layoutType: 'Compact', mode: 'Create'})
    propertyOrFunction(value) {
        const {data, error} = value;
        if(data) {
            console.log('getalyout: '+ JSON.stringify(data));
        } else if(error) {
            console.log('getLayout error: '+ JSON.stringify(error));
        }
    };

    connectedCallback() {
        console.log('recordId contact detail:'+ this.recordId);
    }

    @wire(getRecord, {recordId: "0032w00001MyHLbAAN",fields: [ACCOUNTID_FIELD]})
    contacts;

    get AccountId() {
        return getFieldValue(this.contacts.data, ACCOUNTID_FIELD);
    }

    wiredData
    @wire(getContactListWired, { contId: '$recordId'})
    wiredBatchData(value) {
        this.wiredData = value; 
        const { data, error } = value; 
        if (data) {    
            this.demoData = data.hasOwnProperty("Id") ? data[0].Id : undefined ;
            if(this.demoData == undefined) {
                console.log("Something went wrong!");
            } else {
                console.log(':'+ this.demoData);
            }
            
        }
        else if (error) {
            console.log('getContactListWired error:'+ error);
        }
    }
}