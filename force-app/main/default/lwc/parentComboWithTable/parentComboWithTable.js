import { LightningElement, api, wire, track } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import getTransRecords from '@salesforce/apex/comoboboxAndTableQuickActionController.getTransRecords'
import receiveOppId from '@salesforce/apex/comoboboxAndTableQuickActionController.receiveOppId'
import NAME from '@salesforce/schema/Contact.Name';
//import BATCH from '@salesforce/schema/Trans__c.Batch__c';
 
export default class ParentComboWithTable extends LightningElement {
    @api recordId;
    @track transList

    oppId;
    errors;

    @track
    columns = [
        {
            label: 'Name',
            fieldName: NAME.fieldApiName,
            editable: false,
            type: 'text'
        },
        // {
        //     label: 'Invoice',
        //     fieldName: BATCH.fieldApiName,
        //     editable: false
        // },

        {
            label: 'Account',
            fieldName: 'Account',
            type: 'lookup'
        },

        // {
        //     label: 'Individual',
        //     fieldName: 'Individual',
        //     editable: false
        // },

        // {
        //     label: 'State',
        //     fieldName: 'State',
        //     editable: false
        // },
    ];

    handleSave(){
        console.log('Transmit !!')
        // receiveOppId({oppId:this.oppId})
        // .then(results => {
        //     console.log('Promise::', results);
        //     const toastEvent = new ShowToastEvent({
        //         title:'Success!',
        //         message:'Process Started!!',
        //         variant:'success'
        //     })
        //     this.dispatchEvent(toastEvent);
        // })
        // .catch(error => {
        //     this.errors = reduceErrors(error);
        //     console.log('Eror', this.errors);
        // });
        this.dispatchEvent(new CloseActionScreenEvent());
    }
 
    handleNext(){
        console.log('handleNext start');
        this.template.querySelector('c-combox-and-table-quick-action').getTransId();
        console.log('handleNext end');
    }

    handleClose() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    @api
    handleValueSelectedOnAccount(event) {
        console.log('handleValueSelectedOnAccount'+ event.detail)
        this.oppId = event.detail;
        console.log('oppId-->>'+ this.oppId);
        getTransRecords({oppId:this.oppId})
        .then(result  => {  
            console.log('result->' + result);
            console.log('JSON.stringify(result)->' + JSON.stringify(result));
            let parsedData = JSON.parse(JSON.stringify(result))
            parsedData.forEach(ele => {
                if(ele.Agency__c != undefined )
                    ele.Account = ele.Agency__r.Name;
                if(ele.Individual__c != undefined )
                    ele.Individual = ele.Individual__r.Name;
                if(ele.State__c != undefined )
                    ele.State = ele.State__r.Name;
            });
            this.transList = parsedData;
        })
        .catch(error => {
            this.errors = reduceErrors(error);
            console.log('Eror', this.errors);
        });
    }
}