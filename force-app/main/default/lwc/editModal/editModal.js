import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class EditModal extends LightningModal {
    
    @api recordId;
    @api label; 
    @api rowdata;
    data = [];
    // fieldObj = [
    //     {label: 'Name', value:null},
    //     {label: 'Type', value:null},
    //     {label: 'Amount__c', value:null},
    //     {label: 'Email__c', value:null},
    //     {label: 'Industry', value:null}
    // ];


    connectedCallback() {
        // this.fieldObj = this.fieldObj.map((item,index) => {
        //     item.label == 'Name' ? item.value = this.rowdata["Name"] : item.value=null
        //     item.label == 'Type' ? item.value = this.rowdata["Type"] : item.value=null
        //     item.label == 'Amount__c' ? item.value = this.rowdata["Amount__c"] : item.value=null
        //     item.label == 'Email__c' ? item.value = this.rowdata["Email__c"] : item.value=null
        //     item.label == 'Industry' ? item.value = this.rowdata["Industry"] : item.value=null
        //     return {...item}
        // })

        this.data.push(this.rowdata);
    }

    updateModal(event) {
        event.preventDefault();
        // const data = [{"fields" : {"Id":"001Ig000008N2DCIA0","Name":"Acme Update","Phone":"(415) 555-1212"}}]
        console.log(event.detail.fields)
        let editValues  = event.detail.fields;
        editValues.Id = this.rowdata["Id"];
        const changedData = [{"fields":editValues}]
        const update = new CustomEvent('update', {
            detail:changedData
        })
        this.dispatchEvent(update);
        this.closeModal();
    }

    closeModal() {
        this.close();
    }
}