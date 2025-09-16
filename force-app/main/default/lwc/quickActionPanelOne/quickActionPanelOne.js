import { LightningElement, api } from 'lwc';

export default class QuickActionPanelOne extends LightningElement {

    @api invoke() {
        console.log("Hi, I'm an action.");
    }

    
}