import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProcessQueues from '@salesforce/apex/BpmManagerCtrl.getProcessQueues';
import getPortalUsers from '@salesforce/apex/BpmManagerCtrl.getPortalUsers';
import getProcessTasks from '@salesforce/apex/BpmManagerCtrl.getProcessTasks';
import getProcessTaskStatus from '@salesforce/apex/BpmManagerCtrl.getProcessTaskStatus';

export default class TodoHeader extends LightningElement {
    @api todoSize=0;
    
    searchTerm='';
    processTaskId=null;
    processTaskOptions=[];
    processQueueOptions=[];
    assignId='';
    assignNameOptions=[];
    stage='';
    stageOptions=[
        {label:'---- All ----', value:''},
        {label:'Waiting', value:'Waiting'},
        {label:'Working', value:'Working'},
        {label:'Complete', value:'Complete'},
        {label:'Exception', value:'Exception'},
        {label:'Undefined', value:'Undefined'} 
    ];

    statusOptions = [];

    taskName = {
        primaryField: 'Name',
    }

    filtereArray = [];

    connectedCallback() {
        this.getProcessTaskNameList();
        this.getAssignNameList();
        this.getProcessQueueNameList();
        this.getProcessTaskStatusList();
    }

    getProcessQueueNameList() {
        getProcessQueues()
        .then((data) => {
            this.processQueueOptions = data.map(item => {
                return {label:item.Name, value:item.Id, selected:false}
            })
        })
        .catch((error) => {
            this.showToast('Error', error.body.message, 'error');
        })
    }

    getAssignNameList() {
        getPortalUsers()
        .then((data) => {
            this.assignNameOptions = data.map(item => {
                return {label:item.Name, value:item.Id}
            })
            this.assignNameOptions.unshift({label:'---- All ----', value:''});
        })
        .catch((error) => {
            this.showToast('Error', error.body.message, 'error');
        })
    }

    getProcessTaskNameList() {
        getProcessTasks()
        .then((data) => {
            this.processTaskOptions = data.map(item => {
                return {label:item.Name, value:item.Id}
            })
            this.processTaskOptions.unshift({label:'---- All ----', value:''});
        })
        .catch((error) => {
            this.showToast('Error', error.body.message, 'error');
        })
    }

    getProcessTaskStatusList() {
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

    selectLifecycleStage(event) {
        this.stage = event.target.value;
    }

    selectAssignName(event) {
        this.assignId = event.target.value;
    }
    
    queueNameList=[];
    selectQueueName(event) {
        this.queueNameList = event.detail.selectedvalues;
    }

    selectProcessTask(event) {
        this.processTaskId = event.detail.recordId;
    }
    
    statusList=[];
    selectStatus(event) {
        this.statusList = event.detail.selectedvalues
    }

    searchProccessChange(event) {
        this.searchTerm = event.target.value;
        if(this.searchTerm.length==0) {
            const searchEvent = new CustomEvent('clearsearch', {
                detail: {searchTerm: this.searchTerm.length}
            }) 
            this.dispatchEvent(searchEvent);
        }       
    }

    searchProccessKey(event) {
        const hitEntered = event.keyCode === 13;
        if(hitEntered && this.searchTerm) {
            this.searchProccess();
        }
    }
    
    searchProccess() {
        if(this.searchTerm) {
            const searchEvent = new CustomEvent('search', {
                detail: {searchTerm: this.searchTerm}
            })
            this.dispatchEvent(searchEvent);
        }
    } 
    
    applyFilterHandler() {
        const searchEvent = new CustomEvent('search', {
            detail: {queueNameList:this.queueNameList, statusList:this.statusList, processTask:this.processTaskId, lifecyclestage:this.stage, assignto:this.assignId}
        })
        this.dispatchEvent(searchEvent);
    }

    clearFilterHandler() {
        const searchEvent = new CustomEvent('clearsearch', {
            detail: {searchTerm: this.searchTerm.length}
        }) 
        this.dispatchEvent(searchEvent);
        this.queueNameList = [];
        this.statusList = [];
        this.processTaskId = null;
        this.stage = '';
        this.assignId = '';
        this.template.querySelectorAll('c-bpm-manager-search-combobox').forEach(element => {
            element.clearSearchField();
        });
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