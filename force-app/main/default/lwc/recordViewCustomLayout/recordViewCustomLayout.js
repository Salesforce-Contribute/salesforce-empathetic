import { LightningElement, api } from 'lwc';

export default class RecordViewCustomLayout extends LightningElement {
    @api recordId;
    @api objectApiName;
    @api fields=[];

    connectedCallback() {
        console.log('ObjectApiName= '+this.objectApiName);
        if(this.objectApiName=='Contact'){
            this.fields = ["AccountId", "Name", "Title", "Phone", "Email"]
        }
        else if(this.objectApiName=='Account') {
            this.fields = ["Name", "Phone", "Website", "Amount", "Type"]
        }
    }
}