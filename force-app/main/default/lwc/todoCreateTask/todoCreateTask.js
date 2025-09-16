import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity'
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName'

export default class TodoCreateTask extends LightningElement {
    @api stage;
    @api item;
    @api openNewTask;
    portalUser;
    processQueue;
    statusValue='';
    descriptionValue;

    statusOptions = [];

    assignInfo = {
        primaryField: 'Name',
    }
    processInfo = {
        primaryField: 'Name',
    }

    get openForSameStage() {
        return this.item.StageName == this.stage;
    }

    @wire(getObjectInfo, {objectApiName:OPPORTUNITY_OBJECT})
    objectInfo;

    @wire(getPicklistValues, {recordTypeId:'$objectInfo.data.defaultRecordTypeId',fieldApiName:STAGE_FIELD})
    stagePicklistValues({ data, error}){
        if(data){
            this.statusOptions = data.values.map(item => {
                return {label:item.label, value:item.value}
            })
        }
        if(error){
            console.error(error)
        }
    }

    connectedCallback() {
        
    }

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

    assignToHandler(event) {
        this.portalUser = event.detail.recordId;
    }

    processHandler(event) {
        this.processQueue = event.detail.recordId;
    }

    selectStatus(event) {
        this.statusValue = event.detail.value;
    }

    descriptionInputHandler(event) {
        this.descriptionValue = event.target.value;
    }

    addTaskHandler() {
        const saveEvent = new CustomEvent('save', {
            detail: {assignedToId:this.portalUser, processQueueId:this.processQueue, status:this.statusValue, description: this.descriptionValue}
        })
        this.dispatchEvent(saveEvent);
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