import { LightningElement, api } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';


export default class DemoLookup extends LightningElement {

    @api recordId;
    parentAccountSelectedRecord;

    handleValueSelectedOnAccount(event) {
        this.parentAccountSelectedRecord = event.detail;        
    }

    handleSave(){
        this.template.querySelector('c-reusable-lookup').saveAccount();
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    handleClose() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

}