import { LightningElement,wire } from 'lwc';
import { getRecordCreateDefaults } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import FORM_FACTOR from '@salesforce/client/formFactor';

export default class ClientFormFactor extends LightningElement {

    @wire(getRecordCreateDefaults, { objectApiName: ACCOUNT_OBJECT, formFactor: FORM_FACTOR})
    getFormFactor({ data, error }) {
        if (data) {
            console.log('Form Factor:', data.formFactor);
            console.log('Default Values:', data.defaultValues);
        } else if (error) {
            console.error('Error fetching record create defaults:', error);
        }
    }
}