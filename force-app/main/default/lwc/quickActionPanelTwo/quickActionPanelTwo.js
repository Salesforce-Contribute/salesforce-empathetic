import { LightningElement, api } from 'lwc';

export default class QuickActionPanelTwo extends LightningElement {

    @api recordId;

    connectedCallback() {
        console.log('QuickActionPanelTwo: ', this.recordId);
    }
}