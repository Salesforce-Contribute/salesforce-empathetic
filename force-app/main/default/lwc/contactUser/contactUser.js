import { LightningElement,track } from 'lwc';
import getContacts from '@salesforce/apex/DatatableController.getContacts'

export default class ContactUser extends LightningElement {

    @track customDataList = [];
    connectedCallback(){
        this.fetchRecords();
    }

    fetchRecords(){
        getContacts()
        .then(result => {
            this.customDataList = result;
            console.log('Contact Data: '+ JSON.stringify(this.customDataList))
        })
        .catch(error => {
            console.log('Datatable Error:', error);
        })
    }
}