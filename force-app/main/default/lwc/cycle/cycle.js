import { LightningElement, api } from 'lwc';

export default class Cycle extends LightningElement {
    @api cycle

    ready=false;
    connectedCallback(){
        setTimeout(()=>{
            this.ready=true;
        }, 3000);   
    }
}