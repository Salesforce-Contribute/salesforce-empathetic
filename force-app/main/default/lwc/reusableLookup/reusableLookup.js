import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import fetchRecords from '@salesforce/apex/ReusableLookupController.fetchRecords';
import addAccountNameOnCantact from '@salesforce/apex/ReusableLookupController.addAccountNameOnCantact'

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 500;

export default class ReusableLookup extends LightningElement {
    @api recordId;
    @api helpText = "custom search lookup";
    @api label = "Parent Account";
    @api required;
    @api selectedIconName = "standard:account";
    @api objectLabel = "Account";
    recordsList = [];
    selectedRecordName;

    @api objectApiName = ACCOUNT_OBJECT;
    @api fieldApiName = "Name";
    @api otherFieldApiName = "Industry";
    @api searchString = "";
    @api selectedRecordId = "";
    @api parentRecordId;
    @api parentFieldApiName;

    preventClosingOfSerachPanel = false;


    get methodInput() {
        return {
            objectApiName: this.objectApiName,
            fieldApiName: this.fieldApiName,
            otherFieldApiName: this.otherFieldApiName,
            searchString: this.searchString,
            selectedRecordId: this.selectedRecordId,
            parentRecordId: this.parentRecordId,
            parentFieldApiName: this.parentFieldApiName
        };
    }

    get showRecentRecords() {
        if (!this.recordsList) {
            return false;
        }
        return this.recordsList.length > 0;
    }

    //getting the default selected record
    connectedCallback() {
        if (this.selectedRecordId) {
            this.fetchSobjectRecords(true);
        }
    }

    //call the apex method
    fetchSobjectRecords(loadEvent) {
        console.log('methodInput', this.methodInput);
        fetchRecords({
            inputWrapper: this.methodInput
        }).then(result => {
            if (loadEvent && result) {  
                this.selectedRecordName = result[0].mainField;
            } else if (result) {
                this.recordsList = JSON.parse(JSON.stringify(result));
            } else {
                this.recordsList = [];
            }
        }).catch(error => {
            console.log(error);
        })
    }

    get isValueSelected() {
        return this.selectedRecordId;
    }

    //handler for calling apex when user change the value in lookup
    handleChange(event) {
        this.searchString = event.target.value;
        this.fetchSobjectRecords(false);
    }

    //handler for clicking outside the selection panel
    handleBlur() {
        this.recordsList = [];
        this.preventClosingOfSerachPanel = false;
    }

    //handle the click inside the search panel to prevent it getting closed
    handleDivClick() {
        this.preventClosingOfSerachPanel = true;
    }

    //handler for deselection of the selected item
    handleCommit() {
        this.selectedRecordId = "";
        this.selectedRecordName = "";
    }

    //handler for selection of records from lookup result list
    handleSelect(event) {
        let selectedRecord = {
            mainField: event.currentTarget.dataset.mainfield,
            subField: event.currentTarget.dataset.subfield,
            id: event.currentTarget.dataset.id
        };
        this.selectedRecordId = selectedRecord.id;
        this.selectedRecordName = selectedRecord.mainField;
        this.recordsList = [];
        // Creates the event with Parameters.
        const selectedEvent = new CustomEvent('valueselected', {
            detail: selectedRecord
        });
        //dispatching the custom event
        this.dispatchEvent(selectedEvent);
    }
    
    //to close the search panel when clicked outside of search input
    handleInputBlur(event) {
        // Debouncing this method: Do not actually invoke the Apex call as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            if (!this.preventClosingOfSerachPanel) {
                this.recordsList = [];
            }
            this.preventClosingOfSerachPanel = false;
        }, DELAY);
    }

   
    @api
    saveAccount(){
        console.log('Save::', this.selectedRecordName);
        console.log('ContId::', this.recordId);
        console.log('acctId::', this.selectedRecordId);
        addAccountNameOnCantact({value: this.selectedRecordName, acctId:this.selectedRecordId, contId:this.recordId})
        .then(contacts => {
            notifyRecordUpdateAvailable([{recordId: this.recordId}]);
            const toastEvent = new ShowToastEvent({
                title:'Added Account !',
                message:'Successfully add account',
                variant:'success'
            })
            this.dispatchEvent(toastEvent);
        })
        .catch(error => {
            this.errors = reduceErrors(error); // code to execute if the promise is rejected
            console.log('Eror', this.errors);
        });

    }
}