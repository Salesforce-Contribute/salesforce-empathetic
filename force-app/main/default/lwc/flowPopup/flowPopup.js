import { LightningElement, wire, api} from 'lwc';
import { FlowNavigationBackEvent , FlowNavigationFinishEvent, FlowAttributeChangeEvent } from 'lightning/flowSupport';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import retrieveAccounts from '@salesforce/apex/TablePagination.retrieveAccounts';
import updateAmount from '@salesforce/apex/TablePagination.updateAmount'
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Type', fieldName: 'Type' },
    { label: 'Amount', fieldName: 'Amount__c', editable:true },
    { label: 'BillingCountry', fieldName: 'BillingCountry' },
];

export default class FlowPopup extends LightningElement {
    @api contactList;
    page = 1;
    items = []; 
    data = []; 
    columns; 
    startingRecord = 1; 
    endingRecord = 0; 
    pageSize = 5; 
    totalRecountCount = 0; 
    totalPage = 0; 
    selectedRows = [];
    wiredActivities;
    
    @wire(retrieveAccounts)
    wiredAccounts(value) {
        this.wiredActivities = value;
        const {data, error} = value;
        if (data) {
            this.items = data;
            console.log(JSON.stringify(data));
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

    handleButtonClick(){
        console.log('----handleButtonClick-----');
        retrieveAccounts()
        .then((response)=>{
            var contactList = response;
            console.log('---contactList----', contactList);
            const attributeChangeEvent = new FlowAttributeChangeEvent('contactList', contactList);
            this.dispatchEvent(attributeChangeEvent);
            this.handleClose();
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
        
        // var contactList = [{"Id":"0012w00001R6qgoAAB","Name":"Express Logistics and Transport","Type":"Customer - Channel","Amount__c":3454},{"Id":"0012w00001R6qgnAAB","Name":"United Oil & Gas Corp.","Type":"Customer - Direct","Amount__c":5342},{"Id":"0012w000026ssg8AAA","Name":"Lightning Web Components Specialist Superbadge","BillingCountry":"California"},{"Id":"0012w000027mdbuAAA","Name":"TestAccount1"},{"Id":"0012w000027mecXAAQ","Name":"TEsyt11111"},{"Id":"0012w0000297NU6AAM","Name":"New Line Cinema"},{"Id":"0012w0000297O53AAE","Name":"WingNut Films"},{"Id":"0012w0000297OCnAAM","Name":"WingNut Films"}];
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
        this.dispatchEvent(new FlowNavigationFinishEvent());
    }

    handleClose(){
        this.dispatchEvent(new FlowNavigationFinishEvent());
    }
}