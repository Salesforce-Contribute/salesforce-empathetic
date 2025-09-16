import { LightningElement, api} from 'lwc';

export default class Button extends LightningElement {
    @api label 
    @api icon 

    handleButton(event){
        const factor = event.target.dataset.factor
        console.log('From Button :'+ factor)
        this.dispatchEvent(new CustomEvent('buttonclick'), {
           
        })
    }
}