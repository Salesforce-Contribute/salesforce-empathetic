import { LightningElement, track, wire } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccount from '@salesforce/apex/PaginationController.getAccount';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Type', fieldName: 'Type' },
    { label: 'Amount', fieldName: 'Amount__c', editable:true },
    { label: 'BillingCountry', fieldName: 'BillingCountry' },
];

export default class TablePaginationWithSoql extends LightningElement {

    columns = COLUMNS;
    @track dataList = [];
    @track selectedRows = [];
    accountActivites;
    limit = 3; // set limit for every page want 5 - 5 records only
    offset = 0; //from which position you want to get record
    
    totalRecountCount = 0;
    totalPage = 0;
    perPageRecord = this.limit;
    startingRecord = 1;
    endingRecord = this.perPageRecord;
    page = 1;
    lastRecordNumber = 0;
    pageNumber;

    connectedCallback() {
        getAccount({limitValue: this.limit, offsetValue: this.offset})
        .then((value) => {
            console.log(value);
        })
        .catch((error) => {
            this.dataList = undefined;
            this.showToast(error.statusText, error.body.message, 'Error');
        })
    
    }

    // @wire(getAccount, {limitValue: '$limit', offsetValue: '$offset'}) 
    // wireGetAccount(value){
    //     console.log(value)
    //     this.accountActivites = value;
    //     const {data, error} = value;
    //     if(data) {
    //         this.dataList = data;
    //         this.totalRecountCount = 25;
    //         this.totalPage = Math.ceil(this.totalRecountCount / this.perPageRecord);
    //     }
    //     else if(error) {
    //         this.dataList = undefined;
    //         this.showToast(error.statusText, error.body.message, 'Error');
    //     }
    // }
    
    firstPageHandler() {
        this.page = 1;
        this.offset = 0;
        this.recordPerPage(this.page);
    }

    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1;
            this.offset = this.offset-this.limit;
            this.recordPerPage(this.page);
        }
    }

    get isPreviousDisable() {
        return this.page==1;
    }

    nextHandler() {
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.page + 1;
            this.offset = this.offset+this.limit;
            this.recordPerPage(this.page);
        }
    }

    lastPageHandler() {
        this.page = this.totalPage;
        this.limit = this.limit;
        //console.log('OFFSET =>'+Math.ceil(this.totalRecountCount / this.limit) - this.totalRecountCount)
        // this.offset = Math.ceil(this.totalRecountCount / this.limit) - this.totalRecountCount;
        if(this.totalRecountCount % this.limit == 0) 
            this.offset = this.totalRecountCount - this.limit;
        
        console.log(this.page, this.limit, this.offset);
        this.recordPerPage(this.page);
    }

    get isNextDisable() {
        return this.page==this.totalPage;
    }

    recordPerPage(page) {
        this.startingRecord = ((page - 1) * this.perPageRecord);
        this.endingRecord = (this.perPageRecord * page);
        this.endingRecord = (this.endingRecord > this.totalRecountCount) ? this.totalRecountCount : this.endingRecord;
        this.startingRecord = this.startingRecord + 1;
    }

    pageNumberHandler(event) {
        this.pageNumber = event.target.value;
    }
    
    goToPageHandler() {
        if(this.pageNumber >= 1 && this.pageNumber <= this.totalPage ){
            this.page = this.pageNumber
            console.log(this.page, this.perPageRecord, this.totalPage, this.totalRecountCount);
            this.offset = this.limit * this.page;
            this.recordPerPage(this.page);
        }
    }

    handleSave() {
        alert('Hi, I blank so please write code for me!');
    }

    handleClose() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    showToast(title,message,variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        )
    }

}