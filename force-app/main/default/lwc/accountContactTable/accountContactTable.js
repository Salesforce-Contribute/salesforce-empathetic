import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getContacts from '@salesforce/apex/DatatableController.getContacts'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FIRSTNAME_FIELD from "@salesforce/schema/Contact.FirstName";
import LASTNAME_FIELD from "@salesforce/schema/Contact.LastName";
import ID_FIELD from "@salesforce/schema/Contact.Id";
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";
import getForm from '@salesforce/apex/FieldSetController.getForm';

const CONTACT_OBJECT = 'Contact';
export default class AccountContactTable extends LightningElement {

    @track customDataList=[];
    @track wrapperList=[];
    @track showList = []
    @track error;

    @api recordId;
    @api objectName;
    @api fieldSet;
    @track fields;

    disabled = false;
    accountId;
    isModalOpen = false;
    isRenderFieldForm = false;
    contactId;

    sortedColumn;
    sortedDirection;
    nameUpBool;
    nameDWBool;
    FirstNameUpBool;
    FirstNameDWBool;
    LastNameUpBool;
    LastNameDWBool;
    EmailUpBool;
    EmailDWBool;

    wiredContact;
    @wire(getContacts)
    wiredContacts(value){
        this.wiredContact = value;
        const {data, error} = value;
        if(data){
            this.customDataList = data;
            let endDate = Date.now();
            let startDate, timeDifference, numofDays;
    
            this.wrapperList = this.customDataList.map((item, index) => {
                if(item.CreatedDate != null || item.CreatedDate != undefined){
                    startDate = new Date(item.CreatedDate);
                    timeDifference = endDate - startDate;
                    numofDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                    return {...item, date:startDate, days:numofDays}
                }
            })
            // console.log('wrapperLst: '+ JSON.stringify(this.wrapperList));
            this.error = undefined;
        } else if(error) {
            const toast = new ShowToastEvent({
                title: error.statusText,
                message: error.body.message,
                variant: 'error',
            });
            this.dispatchEvent(toast);
        }
    }
    
    navigateToAccount(event){
        const accountId = event.target.dataset.accountId;
        const contId = event.target.dataset.contactId;
        this.template.querySelector(`[data-contact-id="${contId}"]`).href=`/lightning/r/${accountId}/view`;
        
    }

    handleChange(event) {
        // Display field-level errors and disable button if a name field is empty.
        if (!event.target.value) {
          event.target.reportValidity();
          this.disabled = true;
        } else {
          this.disabled = false;
        }
    }

    updateHandler() {
        const allValid = [...this.template.querySelectorAll("lightning-input")].reduce((validSoFar, inputFields)=>{
            inputFields.reportValidity();
            return validSoFar && inputFields.checkValidity();
        }, true)

        if(allValid){

            const fields = {};
            fields[ID_FIELD.fieldApiName] = this.template.querySelector("[data-field='ContactId']").value
            fields[FIRSTNAME_FIELD.fieldApiName] = this.template.querySelector("[data-field='FirstName']").value;
            fields[LASTNAME_FIELD.fieldApiName] = this.template.querySelector("[data-field='LastName']").value;

            const recordInput = { fields };

            updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                  new ShowToastEvent({
                    title: "Success",
                    message: "Contact updated",
                    variant: "success",
                  }),
                );

                this.cancelHandler();
                refreshApex(this.wiredContact);
                
            })
            .catch((error) => {
                this.dispatchEvent(
                  new ShowToastEvent({
                    title: "Error creating record",
                    message: error.body.message,
                    variant: "error",
                  }),
                );
            });
        } else {
            // The form is not valid
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Something is wrong",
                message: "Check your input and try again.",
                variant: "error",
              }),
            );
        }

    }

    openQuickActionPanel(event) {
        this.isModalOpen = true;
        this.contactId = event.target.dataset.contId;
        this.accountId = event.target.dataset.accId;
        this.wrapperList.find((ele, index)=> {
            if(ele.AccountId == this.accountId && ele.Id == this.contactId)
                this.showList.push(ele);
        })
        if(this.showList.length==0){
            this.message = 'No information found !'
        }
        // this.template.querySelector(`[data-contact-id="${contId}"]`).href=`/lightning/r/${accountId}/view`;
    }

    cancelHandler() {
        this.isModalOpen = false;
        this.isRenderFieldForm = false;
        this.showList = [];
    }

    // editDetail(event) {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__recordPage',
    //         attributes: {
    //             recordId: event.target.dataset.contId,
    //             objectApiName: CONTACT_OBJECT,
    //             actionName: 'edit'
    //         },
    //     });
    // }

    editFormDetails(event) {
        this.isRenderFieldForm = true;
        this.recordId = event.target.dataset.contId;
        this.objectName = 'Contact';
        this.fieldSet = 'ContactFields';
        getForm({ recordId: this.recordId, objectName:this.objectName, fieldSetName:this.fieldSet})
        .then(result => {
            // console.log('Data:'+ JSON.stringify(result));
            if (result) {
                this.fields = result.Fields;
                this.error = undefined;
            }
        }) .catch(error => {
            const event = new ShowToastEvent({
                title: error.statusText,
                message: error.body.message,
                variant: 'error',
            })
            this.dispatchEvent(event);
            this.error = error;
        }); 
    }

    saveClick(e)
    {
        const inputFields = e.detail.fields;
        this.template.querySelector('lightning-record-edit-form').submit(inputFields);
    }
    validateFields() {
        return [...this.template.querySelectorAll("lightning-input-field")].reduce((validSoFar, field) => {
            return (validSoFar && field.reportValidity());
        }, true);
    }

    handleSuccess(e)
    {
        this.showMessage('Record Saved Successfully','success');
        this.cancelHandler();
        return refreshApex(this.wiredContact);
        
    }
    handleError(e)
    {
        this.template.querySelector('[data-id="message"]').setError(e.detail.detail);
        e.preventDefault();
    }

    showMessage(message,variant)
    {
        const event = new ShowToastEvent({
            title: 'Record Save',
            variant: variant,
            mode: 'dismissable',
            message: message
        });
        this.dispatchEvent(event);
    }


    sortRecs(event){

        this.nameUpBool = false;
        this.nameDWBool = false;
        this.FirstNameUpBool = false;
        this.FirstNameDWBool = false;
        this.LastNameUpBool = false;
        this.LastNameDWBool = false;
        this.EmailUpBool = false;
        this.EmailDWBool = false;
        this.DateUpBool = false;
        this.DateDwBool = false;
        this.DaysUpBool = false;
        this.DaysDwBool = false;

        let colName = event ? event.target.name : undefined;

        if(this.sortedColumn === colName)
            this.sortedDirection = (this.sortedDirection === 'asc' ? 'desc' : 'asc');
        else 
            this.sortedDirection = 'asc';
        
        let isReserve = this.sortedDirection === 'asc' ? 1 : -1;

        if(colName)
            this.sortedColumn = colName;
        else
            colName = this.sortedColumn;

        switch(colName){
            case "AccountName":
                if ( this.sortedDirection == 'asc' )
                    this.nameUpBool = true;
                else
                    this.nameDWBool = true;
            
                break;

            case "FirstName":
                if ( this.sortedDirection == 'asc' )
                    this.FirstNameUpBool = true;
                else
                    this.FirstNameDWBool = true;
            
                break;
            case "LastName":
                if ( this.sortedDirection == 'asc' )
                    this.LastNameUpBool = true;
                else
                    this.LastNameDWBool = true;
            
                break;
            case "Email":
                if ( this.sortedDirection == 'asc' )
                    this.EmailUpBool = true;
                else
                    this.EmailDWBool = true;
            
                break;
            case "Date":
                if ( this.sortedDirection == 'asc' )
                    this.DateUpBool = true;
                else
                    this.DateDwBool = true;
            
                break;
            case "Days":
                if ( this.sortedDirection == 'asc' )
                    this.DaysUpBool = true;
                else
                    this.DaysDwBool = true;
            
                break;
        }

        this.wrapperList = JSON.parse( JSON.stringify(this.wrapperList)).sort((a,b)=>{

            if(colName==='AccountName'){
                let x = a.Account.Name;
                let y = b.Account.Name;
                x = x ? x.toLowerCase() : 'z'; 
                y = y ? y.toLowerCase() : 'z';
                return x > y ? 1 * isReserve : -1 * isReserve;
            }

            a = a[ colName ] ? a[ colName ].toLowerCase() : 'z'; 
            b = b[ colName ] ? b[ colName ].toLowerCase() : 'z';
            return a > b ? 1 * isReserve : -1 * isReserve;
        })
    }

    // connectedCallback(){
    //     this.fetchRecords();
    // }

    // fetchRecords(){
    //     getContacts()
    //     .then(result => {
    //         this.customDataList = result;
    //         let num = 1;
    //         let endDate = Date.now();
    //         let startDate, timeDifference, numofDays;

    //         this.wrapperList = this.customDataList.map((item, index) => {
    //             if(item.CreatedDate != null || item.CreatedDate != undefined){
    //                 startDate = new Date(item.CreatedDate);
    //                 timeDifference = endDate - startDate;
    //                 numofDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    //                 return {...item, date:startDate, days:numofDays}
    //             }
    //         })
    //     })
    //     .catch(error => {
    //         console.log('Datatable Error:', error);
    //     })
    // }

}