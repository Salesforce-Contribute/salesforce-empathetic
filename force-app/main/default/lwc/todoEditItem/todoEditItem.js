import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProcessTaskStatus  from '@salesforce/apex/BpmManagerCtrl.getProcessTaskStatus';

export default class TodoEditItem extends LightningElement {

    @api item;
    processTaskId;
    statusValue='';
    descriptionValue;
    statusOptions = [];

    fetchProcessStatus(){
        getProcessTaskStatus()
        .then((data) => {
            this.statusOptions = data.map(item => {
                return {label:item.Label, value:item.Value}
            })
        })
        .catch((error) => {
            this.showToast('Error', error.body.message, 'error');
        })
    }

    selectStatus(event) {
        this.statusValue = event.target.value;
    }

    descriptionInputHandler(event) {
        this.descriptionValue = event.target.value;
    }

    @api
    displayValue(processTaskId) {
        this.fetchProcessStatus();
        this.processTaskId = processTaskId;
        this.statusValue = this.item.status;
        this.descriptionValue = this.item.description;
    }

    updateTaskHandler() {
        if(this.processTaskId) {
            const updateEvent = new CustomEvent('update', {
                detail: {processTaskId:this.processTaskId, status:this.statusValue, description: this.descriptionValue}
            })
            this.dispatchEvent(updateEvent);
        }
        this.cancelTaskHandler();
    }

    cancelTaskHandler() {
        const close = false;
        const cancelEvent = new CustomEvent('cancel', {
            detail: {cancelTask: close}
        })
        this.dispatchEvent(cancelEvent);
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: 'dismissable',
        });
        this.dispatchEvent(event);
    }
}