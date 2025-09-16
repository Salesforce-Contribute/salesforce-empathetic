import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';

export default class MyModal extends LightningModal {
    @api label;
    @api comboboxOptions;
    @track formData = {userName:null, selectedFruit:null};

    filter;
    displayInfo = {
        primaryField: 'FirstName',
        additionalFields: ['Account.Name']
    };
    
    // this.filter = {
    //     criteria: [
    //         {fieldPath: 'Account.Name', operator: 'eq', value: 'LWC Specialist Superbadge'}
    //     ],
    //     filterLogic: '1',
    // };

    matchingInfo = {
        primaryField: { fieldPath: 'Name' },
        additionalFields: [{ fieldPath: 'Phone' }],
    };

    handleChange(event) {
        if(event.target.name=='input-name'){
            this.formData.userName = event.target.value;
        }
        if(event.target.name=='input-option'){
            this.formData.selectedFruit = event.target.value;
        }
    }

    saveModal() {
        const save = new CustomEvent('save', {
            detail:this.formData
        })
        this.dispatchEvent(save);
        this.closeModal();
    }

    closeModal() {
        this.close();
    }
}