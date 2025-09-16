import LightningModal from 'lightning/modal';
import { api } from 'lwc';
import getPageLayoutFields from '@salesforce/apex/FieldController.getPageLayoutFields'

export default class NewStandardModal extends LightningModal {

    @api header;
    objectApiName = 'Boat__c';
    fields;

    connectedCallback() {
        getPageLayoutFields({objectName:'Boat__c'})
        .then((result) => {
            console.log(result);
            this.fields = result;
        })
        .catch((error) => {
            console.log(error);
        })
    }

    handleSuccess() {
        console.log('Success');
    }
}