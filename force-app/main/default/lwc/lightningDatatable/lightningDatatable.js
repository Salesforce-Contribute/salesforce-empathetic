import { LightningElement, wire } from 'lwc';
import retrieveAccounts from '@salesforce/apex/TablePagination.retrieveAccounts';
import getApiData from '@salesforce/apex/HttpCalloutController.getApiData';
import { NavigationMixin } from "lightning/navigation";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord, deleteRecord  } from 'lightning/uiRecordApi';
import EditModal from 'c/editModal';
import LightningConfirm from 'lightning/confirm';
import { reduceErrors } from 'c/ldsUtils';
import recordUpdateNotify from '@salesforce/apex/TablePagination.recordUpdateNotify'

/*const columns = [
    { label: 'Name', fieldName: 'Name', initialWidth:100 },
    { label: 'Type', fieldName: 'Type', initialWidth:100 },
    { label: 'Amount', fieldName: 'Amount__c', initialWidth:100 },
    { label: 'BillingCountry', fieldName: 'BillingCountry', initialWidth:150 },
    { label: 'Email__c', fieldName: 'Email__c', initialWidth:100 },
    { label: 'Industry', fieldName: 'Industry', initialWidth:100 },
    { label: 'Website', fieldName: 'Website', initialWidth:100 },
    { label: 'Phone', fieldName: 'Phone', initialWidth:100 },
    { label: 'Active__c', fieldName: 'Active__c', initialWidth:100 },

];*/

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Name', fieldName: 'Name'},
    { label: 'Type', fieldName: 'Type' },
    { label: 'Amount', fieldName: 'Amount__c' },
    { label: 'Email__c', fieldName: 'Email__c' },
    { label: 'Industry', fieldName: 'Industry' },
    { type: 'action', typeAttributes: { rowActions: actions }}

];

const apiColumns = [
    { label: "FirstName", fieldName:"firstName", type: "text"},
    { label: "LastName", fieldName:"lastName", type: "text"},
    { label: "Age", fieldName:"age", type: "number"},
    { label: "Gender", fieldName:"gender", type: "text"},
    { label: "Email", fieldName:"email", type: "text"},
    { label: "PHone", fieldName:"phone", type: "text"},
    { label: "Username", fieldName:"username", type: "text"},
    { label: "Password", fieldName:"password", type: "text"},
    { label: "BirthDate", fieldName:"birthDate", type: "Date"},
    // { label: "Photo", fieldName:"image", type: ""},
    { label: "BloodGroup", fieldName:"bloodGroup", type: "text"},
]



export default class LightningDatatable extends NavigationMixin(LightningElement) {//NavigationMixin not use when no need edit the the data with standard modal
    columns = columns;
    data;

    apiColumns = apiColumns;
    apiData;

    async connectedCallback() {
        try {
            const res = await getApiData();
            if(res) {
                this.apiData = res.users;
            }
        } catch(error) {
            this.showToast('Failed', error.body.message, 'error');
        }
    }

    wiredActivities
    @wire(retrieveAccounts)
    wiredAccounts(value) {
        this.wiredActivities = value;
        const {data, error} = value;
        if (data) {
            this.data = data;
        } else if (error) {
            console.log(error);
        }
    }
    // connectedCallback() {
    //     retrieveAccounts()
    //     .then(data=>{
    //         this.data = data;
    //     })
    //     .catch(error=>{
    //         console.log(error);
    //     })
    // }

    handleRowSelection(event) {
        console.log('Selected: rows: ');
        console.log(event.detail.selectedRows)
        console.log(JSON.stringify(event.detail));
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        let row = event.detail.row;
        //row = { ...row, Type: 'Prospect', Industry: 'Energy' };
        // console.log(JSON.strirow);
        switch (actionName) {
            case 'edit':
                this.editRow(row);
                break;
            case 'delete':
                this.deleteRow(row);
                break;
            default:
        }
    }

    editRow(row) {
        EditModal.open({
            recordId: row.Id,
            label: `Edit ${row.Name}`,
            size: 'small',
            description: 'Edit the account',
            rowdata: row,
            onupdate: (e) => {
                //stop further propagation of the event
                e.stopPropagation();
                this.handleUpdate(e.detail);
           }
        })
    }

    async handleUpdate(detail) {
        const recordUpdatePromises = detail.map((record) => updateRecord(record));
        let promise = await Promise.all(recordUpdatePromises);
        if(promise) {
            refreshApex(this.wiredActivities);
            this.showToast('Success', 'Account updated', 'success');
        }
    }

    async deleteRow(row) {
        const recordId = row.Id;
        try {
            /*In this line await is needed becuase if we do not use await this handleConfirmClick() method reuturn value which execute 
            the another statement without following response. We want response then execute others statement. What happen we not use await.
            it jump to the catch block and execute this block which we don't want.*/
            const response  = await this.handleConfirmClick(); 
            console.log(response);
            if(response) {
                await deleteRecord(recordId);
                refreshApex(this.wiredActivities);
                this.showToast('Success', 'Account deleted', 'success');
            }

        } catch (error) {
            this.showToast('Error deleting record', reduceErrors(error).join(', '), 'error');
        }
    }

    async handleConfirmClick() {
        const result = await LightningConfirm.open({
            message: 'Are you sure you want to delete this account?',
            variant: 'header',
            label: 'Delete Account',
            theme: 'error'
        });
        return result;
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

    // Standard modal but this will not show the refresh data, You will have to reload the page
    // async editRow(row) {
    //     let accId = row.Id;
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__recordPage',
    //         attributes: {
    //             recordId: accId,
    //             objectApiNamex: 'Account',
    //             actionName: 'edit'
    //         },
    //     })

        //const res = await recordUpdateNotify();
        // if(res.ok==true) {
        //     refreshApex(this.wiredActivities);
        // } else if(res.ok==false) {
        //     console.log(res.body.message);
        // }
        
    //}   
    
    // @wire(recordUpdateNotify)
    // wireNotify(value) {
    //     const {data, error} = value;
    //     if(data) {
    //         console.log(data);
    //     } else if(error) {
    //         console.log(error.body.message);
    //     }
    // }
}

