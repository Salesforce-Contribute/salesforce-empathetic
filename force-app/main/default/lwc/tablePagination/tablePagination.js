import { LightningElement, wire, api} from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import retrieveAccounts from '@salesforce/apex/TablePagination.retrieveAccounts';
import updateAmount from '@salesforce/apex/TablePagination.updateAmount'
import { refreshApex } from '@salesforce/apex';
import { CurrentPageReference } from 'lightning/navigation';


const columns = [
    { label: 'Name', fieldName: 'Name', type:'text', wrapText:true },
    { label: 'Type', fieldName: 'Type' },
    { label: 'Amount', fieldName: 'Amount__c', editable:true },
    { label: 'BillingCountry', fieldName: 'BillingCountry' },
    { label: 'Email__c', fieldName: 'Email__c' },
    { label: 'Industry', fieldName: 'Industry' },
    { label: 'Website', fieldName: 'Website' },
    { label: 'Phone', fieldName: 'Phone' },
    { label: 'Active__c', fieldName: 'Active__c' },

];

export default class TablePagination extends LightningElement {
    @api objectApiName; //this not work
    items = []; 
    data = []; 
    columns; 
    selectedRows = [];
    wiredActivities;
    
    page = 1;
    startingRecord = 1; 
    endingRecord = 0; 
    pageSize = 3; 
    totalRecountCount = 0; 
    totalPage = 0; 

    connectedCallback() {
        console.log('Object api name: '+ this.objectApiName);
    }

    @wire(retrieveAccounts)
    wiredAccounts(value) {
        this.wiredActivities = value;
        const {data, error} = value;
        if (data) {
            this.items = data;
            this.totalRecountCount = data.length;
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            //here we slice the data according page size
            this.data = this.items.slice(0, this.pageSize);
            this.endingRecord = this.pageSize;
            this.columns = columns;
            this.error = undefined;
            console.log('success');
        } else if (error) {
            this.error = error;
            this.data = undefined;
            this.showToast(this.error, 'Error', 'Error'); 
        }
    }

    //press on previous button
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1;
            this.displayRecordPerPage(this.page);
        }
    }

    //press on next button
    nextHandler() {
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.page + 1;
            this.displayRecordPerPage(this.page);
        }
    }

    //this method displays records per page
    displayRecordPerPage(page) {
        this.startingRecord = ((page - 1) * this.pageSize);
        this.endingRecord = (this.pageSize * page);
        this.endingRecord = (this.endingRecord > this.totalRecountCount) ? this.totalRecountCount : this.endingRecord;
        this.data = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
        this.template.querySelector('[data-id="datatable"]').selectedRows = this.selectedRows;
    }

    handleRowSelection(event) {
        let updatedItemsSet = new Set();
        // selected item for maintain.
        let selectedItemsSet = new Set(this.selectedRows);
        // List of items currently loaded for the current view.
        let loadedItemsSet = new Set();

        this.data.map((ele) => {
            loadedItemsSet.add(ele.Id);
        });

        if (event.detail.selectedRows) {
            event.detail.selectedRows.map((ele) => {
                updatedItemsSet.add(ele.Id);
            });

            updatedItemsSet.forEach((id) => {
                if (!selectedItemsSet.has(id)) {
                    selectedItemsSet.add(id);
                }
            });
        }

        loadedItemsSet.forEach((id) => {
            if (selectedItemsSet.has(id) && !updatedItemsSet.has(id)) {
                selectedItemsSet.delete(id);
            }
        });

        this.selectedRows = [...selectedItemsSet];      
    }

    async handleSave(){
        var finalData = []
        const updatedFields = this.template.querySelector('lightning-datatable').draftValues;

        if(this.selectedRows.length !== 0 && updatedFields.length !== 0){
            try{
                for(let i=0; i<this.selectedRows.length; i++){
                    for(let j=0; j<updatedFields.length; j++){
                        if(this.selectedRows[i]===updatedFields[j].Id){
                            finalData.push({id:updatedFields[j].Id, amount:updatedFields[j].Amount__c})
                        }
                    }
                }
                
                console.log('finalData:', finalData)
                //Pass edit field to updateAccountAmmount controller
                const result = await updateAmount({data:finalData})
                console.log(JSON.stringify('Apex result:', result))

                const updateMsg = JSON.stringify(result)
                refreshApex(this.wiredActivities);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record updated successfully',
                        variant: 'success'
                    })
                )
    

            }catch(error){
                console.log('catch:', error)
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating',
                        message: error.body.message,
                        variant: 'error'
                    })
                )
            }

        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'No record selected or edited !',
                    variant: 'error'
                })
            )
        }
        this.handleClose();
    }

    handleClose() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}