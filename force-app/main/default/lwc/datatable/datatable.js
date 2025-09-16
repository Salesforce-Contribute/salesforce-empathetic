import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getContacts from '@salesforce/apex/DatatableController.getContactList'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FIRSTNAME_FIELD from "@salesforce/schema/Contact.FirstName";
import LASTNAME_FIELD from "@salesforce/schema/Contact.LastName";
import ID_FIELD from "@salesforce/schema/Contact.Id";
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";
import getForm from '@salesforce/apex/FieldSetController.getForm';

const OBJECT_NANE = 'Contact';
const DELAY = 300;
export default class Datatable extends NavigationMixin(LightningElement) {
    searchKey = "";

    @track customDataList=[];
    @track wrapperList=[];
    @track showList = []
    @track error;

    @api recordId;
    @api objectName;
    @api fieldSet;
    @track fields;
    @track textColor;

    channel;

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
    @wire(getContacts , { searchKey: "$searchKey" })
    wiredContacts(value){
        this.wiredContact = value;
        const {data, error} = value;
        if(data){
            this.customDataList = data;
            let endDate = Date.now();
            let startDate, timeDifference, numofDays;
    
            this.wrapperList = this.customDataList.map((item) => {
                if(item.CreatedDate != null || item.CreatedDate !== undefined){
                    startDate = new Date(item.CreatedDate);
                    timeDifference = endDate - startDate;
                    numofDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                    this.textColor = numofDays > 56 ? this.textColor = 'slds-yellow': this.textColor = 'slds-black';
                    return {...item, date:startDate, days:numofDays, colorText:this.textColor}
                    //return {...item, date:startDate, days:numofDays}
                }
            })

            
            this.error = undefined;
        } else if(error) {
            this.showMessage(error.statusText, error.body.message, 'error');
        }
    }

    
    handleSearch(event) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
        this.searchKey = searchKey;
        }, DELAY);
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
        console.log('----updateHandler----');
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
                this.showMessage('Success', 'Contact updated', 'success');
                this.cancelHandler();
                refreshApex(this.wiredContact);
                
            })
            .catch((error) => {
                this.showMessage('Error creating record', error.body.message, 'error');
            });
        } else {
            // The form is not valid
            this.showMessage('Something is wrong', 'Check your input and try again.', 'error');
        }

    }

    openQuickActionPanel(event) {
        console.log('---openQuickActionPanel---')
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

    // Standard popup
    editDetail(event) {
        console.log('---editDetail---');
        event.preventDefault();
        this.recordId = event.target.dataset.contId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiNamex: OBJECT_NANE,
                actionName: 'edit'
            },
        });
    }

    viewDetail(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.contId,
                objectApiName: CONTACT_OBJECT,
                actionName: 'view'
            },
        });
    }
    
    //FieldSet 
    editFormDetails(event) {
        this.isRenderFieldForm = true;
        this.recordId = event.target.dataset.contId;
        this.objectName = 'Contact';
        this.fieldSet = 'ContactFields';
        getForm({ recordId: this.recordId, objectName:this.objectName, fieldSetName:this.fieldSet})
        .then(result => {
            console.log('Data:'+ JSON.stringify(result));
            if (result) {
                this.fields = result.Fields;
                this.error = undefined;
            }
        }) .catch(error => {
              this.showMessage(error.statusText, error.body.message, 'error')
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

    async handleSuccess(e)
    {
        this.showMessage('Success', 'Record Saved Successfully','success');
        this.cancelHandler();
        console.log('notifyid: '+ this.recordId);
        return refreshApex(this.wiredContact);
        
    }
    handleError(e)
    {
        this.template.querySelector('[data-id="message"]').setError(e.detail.detail);
        e.preventDefault();
    }

    showMessage(title, message,variant)
    {
        const event = new ShowToastEvent({
            title: title,
            variant: variant,
            message: message,
            mode: 'dismissable',
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
        // this.fetchRecords();
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