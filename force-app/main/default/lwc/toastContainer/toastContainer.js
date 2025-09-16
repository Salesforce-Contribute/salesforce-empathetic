import { LightningElement } from 'lwc';
import ToastContainerMsg from 'lightning/toastContainer';


export default class ToastContainer extends LightningElement {
    connectedCallback() {
        console.log('connectedCallback');
        
    }
    
    handleToastContainer() {
        const toastContainer = ToastContainerMsg.instance();
        toastContainer.maxShown = 5;
        toastContainer.toastPosition = 'top-right';
        toastContainer.containerPosition = 'absolute';
        console.log('toastCOntainer: '+ JSON.stringify(toastContainer));
    }
}
