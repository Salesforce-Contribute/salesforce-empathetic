import { LightningElement, wire, track } from 'lwc';
import getContactCase from '@salesforce/apex/TablePagination.getContactCase';
import deleteContactOrCase from '@salesforce/apex/TablePagination.deleteContactOrCase';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { reduceErrors } from 'c/ldsUtils';
import { NavigationMixin } from 'lightning/navigation';
import LightningConfirm from 'lightning/confirm';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns1 = [
    // {label:'Id', fieldName:'Id', sortable:true},
    {label:'Repayment', fieldName: 'repaymentplan'},
    {label:'Payment Amount', fieldName: 'paymentamount'},
    {label:'First Due Date', fieldName: 'firstduedate'},
    {label:'Principle Disclosed', fieldName: 'principledisclosed'},
    {label:'Total Interest To Be Rapid', fieldName: 'totalinteresttoberapid'},
    {label:'Total Repayment Amount', fieldName: 'totalrepaymentamount'},
    {label:'Action', type: 'action', typeAttributes: { rowActions: actions }}
]

const data1 = [
    {
        Id:'123',
        repaymentplan: 'SAVE',
        paymentamount: 147.77,
        firstduedate: '2024-11-14T07:09:58.000+0000',//'2023/10/23',
        principledisclosed: 318820.13,
        totalinteresttoberapid: 135004.71,
        totalrepaymentamount: 454824.84,
        _children: [
            {
                Id:'123-A',
                repaymentplan: 'Term Level',
                paymentamount: 'Payment Amount',
                firstduedate: 'Number of Terms',
                principledisclosed: 'Est. Start Date',
                totalinteresttoberapid:"",
                totalrepaymentamount:"",
                _children: [
                    {
                        Id:'123-A-A',
                        repaymentplan: 1,
                        paymentamount: 147.77,
                        firstduedate: 12,
                        principledisclosed: '2024-11-14T07:09:58.000+0000',//'2023/10/23',
                        _children: [
                            {
                                Id:'123-A-A-A',
                                repaymentplan: 'Loan Sequeance',
                                paymentamount: '1st Disbursment Date',
                                firstduedate: 'Loan Program',
                                principledisclosed: 'Payment Amount',
                                totalinteresttoberapid: 'Number of Terms',
                                totalrepaymentamount:"",
                            },
                            {
                                Id:'123-A-A-B',
                                repaymentplan: 26,
                                paymentamount: '2024-12-20T11:39:06.000+0000',//'2021/20/12',
                                firstduedate: 'DLUCNS',
                                principledisclosed: 145.77,
                                totalinteresttoberapid: 12,
                            },
                        ]
                    },
                    {
                        Id:'123-A-B',
                        repaymentplan: 2,
                        paymentamount: 3775.63,
                        firstduedate: 120,
                        principledisclosed: '2024-11-14T07:09:58.000+0000',//'2023/10/23',
                        _children: [
                            {
                                Id:'123-A-B-A',
                                repaymentplan: 'Loan Sequeance',
                                paymentamount: '1st Disbursment Date',
                                firstduedate: 'Loan Program',
                                principledisclosed: 'Payment Amount',
                                totalinteresttoberapid: 'Number of Terms',
                                totalrepaymentamount:"",
                            },
                            {
                                Id:'123-A-B-B',
                                repaymentplan: 26,
                                paymentamount: '2024-12-20T11:39:06.000+0000',//'2021/20/12',
                                firstduedate: 'DLUCNS',
                                principledisclosed: 3775.63,
                                totalinteresttoberapid: 120,
                            },
                        ]
                    },
                ]
            },
        ],
    },
    {
        Id:'124',
        repaymentplan: 'SAVE',
        paymentamount: 142.77,
        firstduedate: '2024-10-24T11:39:06.000+0000',//'2023/10/24',
        principledisclosed: 232820.13,
        totalinteresttoberapid: 435004.71,
        totalrepaymentamount: 554824.84,
        _children: [
            {
                Id:'124-A',
                repaymentplan: 'Term Level',
                paymentamount: 'Payment Amount',
                firstduedate: 'Number of Terms',
                principledisclosed: 'Est. Start Date',
                totalinteresttoberapid:"",
                totalrepaymentamount:"",
                _children: [
                    {
                        Id:'124-A-A',
                        repaymentplan: 1,
                        paymentamount: 147.77,
                        firstduedate: 12,
                        principledisclosed: '2024-11-14T07:09:58.000+0000',//'2023/10/23',
                        _children: [
                            {
                                Id:'124-A-A-A',
                                repaymentplan: 'Loan Sequeance',
                                paymentamount: '1st Disbursment Date',
                                firstduedate: 'Loan Program',
                                principledisclosed: 'Payment Amount',
                                totalinteresttoberapid: 'Number of Terms',
                                totalrepaymentamount:"",
                            },
                            {
                                Id:'124-A-A-B',
                                repaymentplan: 26,
                                paymentamount: '2024-12-20T11:39:06.000+0000',//'2021/20/12',
                                firstduedate: 'DLUCNS',
                                principledisclosed: 145.77,
                                totalinteresttoberapid: 12,
                            },
                        ]
                    },
                    {
                        Id:'124-A-B',
                        repaymentplan: 2,
                        paymentamount: 3775.63,
                        firstduedate: 120,
                        principledisclosed: '2024-11-14T07:09:58.000+0000',//'2023/10/23',
                        _children: [
                            {
                                Id:'124-A-B-A',
                                repaymentplan: 'Loan Sequeance',
                                paymentamount: '1st Disbursment Date',
                                firstduedate: 'Loan Program',
                                principledisclosed: 'Payment Amount',
                                totalinteresttoberapid: 'Number of Terms',
                                totalrepaymentamount:"",
                            },
                            {
                                Id:'124-A-B-B',
                                repaymentplan: 26,
                                paymentamount: '2024-12-20T11:39:06.000+0000',//'2021/20/12',
                                firstduedate: 'DLUCNS',
                                principledisclosed: 3775.63,
                                totalinteresttoberapid: 120,
                            },
                        ]
                    },
                ]
            },
        ],
    }
];

const columns = [
    // {label:'Id', fieldName:'Id', sortable:true},
    {label:'Name', fieldName: 'Name', sortable:true},
    {label:'Department', fieldName: 'Department'},
    {label:'Title', fieldName: 'Title'},
    {label: 'Amount', fieldName: 'Amount'},
    {label:'Action', type: 'action', typeAttributes: { rowActions: actions }}
]

export default class GridTable extends NavigationMixin(LightningElement) {

    @track gridColumns = columns;
    @track gridData;

    wiredActivities;
    @wire(getContactCase) 
    wireGetContactCase(value) {
        this.wiredActivities = value;
        const {data, error} = value;
        //if you used en-US -> $2,438,890.00
        //if you used en-In -> $24,38,890.00
        let dollar = new Intl.NumberFormat('en-IN', {style: 'currency', currency: 'USD'});
        if(data) {
            this.gridData = data.map((contact, ind) => {
                return {
                    Id: contact.Id,
                    Name: contact.Name,
                    Department: contact.Department,
                    Title:contact.Title,
                    Amount: contact.Amount__c && `${dollar.format(contact.Amount__c)}`,
                    _children:[{"id":"Id", "casenumber":"CaseNumber", "priority":"Priority", "subject":"Subject"}].map((datafield) => {
                        return {
                            // Id: `child-${datafield.CaseNumber}`,
                            // Id: `child-${contact.Cases[0].CaseNumber}`,
                            // Id: datafield.id,
                            Id: `${contact.Id}-child-1`,
                            Department: datafield.casenumber,
                            Name: datafield.priority,
                            Title: datafield.subject,
                            Amount:null,
                            _children: contact.Cases != undefined && contact.Cases.map((cas) => {
                                return {
                                    Id: cas.Id,
                                    Department: cas.CaseNumber,
                                    Name: cas.Priority,
                                    Title: cas.Subject,
                                    Amount:null,
                                }
                            })
                        }
                    })
                };
            })
            // console.log("griddata => "+ JSON.stringify(this.gridData));
            //CreatedDate: this.formatToDateString(contentVersion.createdDate)
        } else if(error) {
            console.log('gridData error : '+ JSON.stringify(error));
        }
    }

    rowSelection(event) {
        const row = event.detail.selectedRows;
        console.log(JSON.stringify(row));
    }

    rowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

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
        console.log("Edit row => "+ JSON.stringify(row));
        const idStartWith = row.Id.substring(0, 3);
        let rowId=null;
        let objectName=null;
        if(row.Name != 'Priority') {
            if(idStartWith == '003') {
                rowId = row.Id;
                objectName = 'Contact';
            } 
            if(idStartWith == '500') {
                rowId = row.Id.substring(0, 18);
                objectName = 'Case';
            }
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: rowId,
                    objectApiName: objectName,
                    actionName: 'edit'
                },
            })
        } else {
            this.showToast("Info", "Please select record", "info");
        }
    }

    async deleteRow(row) {
        const idStartWith = row.Id.substring(0, 3);
        let rowId=null;
        let objectName=null;
        if(row.Name != 'Priority') {
            if(idStartWith == '003') {
                rowId = row.Id;
                objectName = 'Contact';
            } 
            if(idStartWith == '500') {
                rowId = row.Id.substring(0, 18);
                objectName = 'Case';
            }
            try {
                /*In this line await is needed becuase if we do not use await this handleConfirmClick() method reuturn value which execute 
                the another statement without following response. We want response then execute others statement. What happen we not use await.
                it jump to the catch block and execute this block which we don't want.*/
                const response  = await this.handleConfirmClick(objectName); 
                if(response) {
                    console.log('recordId: '+ rowId);
                    await deleteContactOrCase({recordId: rowId, objectName: objectName})
                    refreshApex(this.wiredActivities);
                    this.showToast('Success', `${objectName} deleted`, 'success');
                    
                }
            } catch (error) {
                this.showToast('Error deleting record', reduceErrors(error).join(', '), 'error');
            }
        } else {
            this.showToast("Info", "Please select record", "info");
        }
    }

    async handleConfirmClick(objectName) {
        const result = await LightningConfirm.open({
            message: `Are you sure you want to delete this ${objectName}?`,
            variant: 'header',
            label: `Delete ${objectName}`,
            theme: 'error'
        });
        return result;
    }

    refreshData() {
        refreshApex(this.wiredActivities);
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
    updateColumnSorting(event) {
        console.log('-------updateColumnSorting-------');
        let fieldName = event.detail.fieldName;
        let sortDirection = event.detail.sortDirection;
        this.sortBy = fieldName;
        this.sortDirection = sortDirection;
        this.sortData(fieldName, sortDirection);
    }

    sortData(fieldName, sortDirection) {
        let sortResult = this.records;
        this.records = sortResult.sort(function (a, b) {
        if (a[fieldName] < b[fieldName])
            return sortDirection === 'desc' ? 1 : -1;
        else if (a[fieldName] > b[fieldName])
            return sortDirection === 'desc' ? -1 : 1;
        else
            return 0;
        })
        this.records = JSON.parse(JSON.stringify(this.records));
    }
}
