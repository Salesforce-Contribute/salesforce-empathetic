import { LightningElement,api } from 'lwc';
import LightningAlert from 'lightning/alert';

export default class ErrorPanel extends LightningElement {
    @api errors;

    async connectedCallback() {
        await LightningAlert.open({
            label: this.errors.statusText, // this is the header text
            message: this.errors.body.message,
            theme: 'error', // a red theme intended for error states
        });
        //Alert has been closed
    }
    
}