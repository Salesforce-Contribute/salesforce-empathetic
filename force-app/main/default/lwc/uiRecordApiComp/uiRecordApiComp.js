import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { createRecord, updateRecord, deleteRecord  } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBookList from '@salesforce/apex/DatatableController.getBookList';
import BOOK_OBJECT from '@salesforce/schema/Book__c';
import ID_FIELD from "@salesforce/schema/Book__c.Id";
import NAME_FIELD from '@salesforce/schema/Book__c.Name';
import PRICE_FIELD from '@salesforce/schema/Book__c.Price__c'
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import ACCOUNT_OBJECT from "@salesforce/schema/Book__c";

const COLUMNS = [
    { label: 'Name', fieldName: 'Name' , editable: true},
    { label: 'Price', fieldName: 'Price__c' , type: 'number', editable: true},
    { type: "button", label: 'Delete', initialWidth: 25, typeAttributes: { name: 'Delete', title: 'Delete', disabled: false, iconPosition: 'left', iconName:'utility:delete', variant:'destructive'}},
];

export default class UiRecordApiComp extends LightningElement {
    bookId;
    name = '';
    price;
    books;
    error;
    draftValues = []; //edit data store

    columns = COLUMNS;

    fields;

    @wire(getObjectInfo, { objectApiName: BOOK_OBJECT })
    objectInfoFun(value) {
        const {data, error} = value;
        if(data) {
            // console.log('==========>'+ JSON.stringify(data.fields));
        } else if(error) {
            console.log(error);
        }
    }

    wiredBookResult;
    @wire(getBookList)
    wiredBooks(value) {
        this.wiredBookResult = value;
        const {data, error} = value;
        if (data) {
            this.books = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            // console.log('error: '+ JSON.stringify(this.error));
            this.books = undefined;
        }
    }

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handlePriceChange(event) {
        this.price = event.target.value;
    }

    async createBookRecord() {
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = this.name;
        fields[PRICE_FIELD.fieldApiName] = this.price;

        const recordInput = { apiName: BOOK_OBJECT.objectApiName, fields };

        createRecord(recordInput)
        .then(book => {
            console.log('createbook:'+ JSON.stringify(book));
            this.bookId = book.id;
            refreshApex(this.wiredBookResult);
            this.showToast('Success', 'Book created', 'success');
            this.resetInput();
        })
        .catch(error => {
            this.showToast('Error', error.body.message, error);
        });
    }

    handleRowAction(event) {
        const recId = event.detail.row.Id;
        const actionName = event.detail.action.name;
        // console.log(recId, actionName);
        if (actionName === 'Delete') {
            this.deleteBookRecord(recId);
        }
        // else if (actionName === 'Edit') {
        //     this.editBookRecord(event.detail);
        // }
    }

    // editBookRecord(bookRec) {
    //     console.log('bookrecord: '+ JSON.stringify(bookRec.row));
    //     this.bookId = bookRec.row.Id;
    // }
    onChangeTable(event) {
        // console.log(event);
    }
    
    async handleSave(event) {

        try {
            // Convert datatable draft values into record objects
            const records = event.detail.draftValues.slice().map((draftValue) => {
                const fields = Object.assign({}, draftValue);
                return { fields };
            });
            
            // Clear all datatable draft values
            this.draftValues = [];
            // Update all records in parallel thanks to the UI API
            // console.log('updated records: '+ JSON.stringify(records));
            const recordUpdatePromises = records.map((record) => updateRecord(record));
            let promise = await Promise.all(recordUpdatePromises);
            if(promise) {
                refreshApex(this.wiredBookResult);
                this.showToast('Success', 'Book updated', 'success');
            }
        } catch(error) {
            console.log('')
        }
        
        /*console.log('----updateHandler----');
        const allValid = [...this.template.querySelectorAll("lightning-input")].reduce((validSoFar, inputFields)=>{
            inputFields.reportValidity();
            return validSoFar && inputFields.checkValidity();
        }, true)

        if(allValid){

            const fields = {};
            fields[ID_FIELD.fieldApiName] = this.bookId;
            fields[NAME_FIELD.fieldApiName] = this.template.querySelector("[data-field='Name']").value;
            fields[PRICE_FIELD.fieldApiName] = this.template.querySelector("[data-field='Price__c']").value;

            const recordInput = { fields };

            updateRecord(recordInput)
            .then(() => {
                this.showToast('Success', 'Book updated', 'success');
                this.resetInput();
                refreshApex(this.wiredBookResult);
            })
            .catch((error) => {
                this.showToast('Error creating record', error.body.message, 'error');
            });
        } else {
            // The form is not valid
            this.showToast('Something is wrong', 'Check your input and try again.', 'error');
        }*/
    }

    async deleteBookRecord(deleteId) {
        const recordId = deleteId;
        // console.log('delete: '+ recordId);
        try {
            await deleteRecord(recordId);
            refreshApex(this.wiredBookResult);
            this.showToast('Success', 'Book deleted', 'success');
        } catch (error) {
            this.showToast('Error deleting record', error.body.message, 'error');
        }
    }
    

    showToast(title, msg, error) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: msg,
            variant: error,
            mode: 'dismissible'
        })
        this.dispatchEvent(toastEvent);
    }

    resetInput() {
        this.name = '';
        this.price = '';
    }
}