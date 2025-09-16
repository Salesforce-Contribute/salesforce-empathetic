import { LightningElement, track } from 'lwc';

export default class RecordPicker extends LightningElement {

   @track selectedRecordId;

    displayInfo = {
        primaryField: 'FirstName',
        additionalFields: ['Account.Name']
    };

    matchingInfo = {
        primaryField: { fieldPath: 'Name' },
        additionalFields: [{ fieldPath: 'Phone' }],
    };

    filter = {
        criteria: [
            {
                fieldPath: 'Website',
                operator: 'eq',
                value: 'http://www.uos.com', //This show only those records where website field value equal to 'http://www.uos.com'
            },
            {
                fieldPath: 'Name',
                operator: 'like',
                value: 'Test%', //This show only those records where Name field value start with Test
            },
        ],
        filterLogic: '1 OR 2' //This show only those record based on above 1 or 2 filter criteria conditions that either should be match with website value or should be match with name field value
    };

    filter = {
        criteria: [
            {
                fieldPath: 'LastModifiedDate',
                operator: 'lt',
                value: { literal: 'TODAY' },
            },
        ],
    };

    changeCustomEvent(event) {
        console.log(event.detail.recordId);
    }

    errorCustomEvent(error) {
        console.log(error);
    }

    handleSelectionChange(event) {
        this.selectedRecordId = event.detail.recordId;
    }

    handleClear() {
        this.selectedRecordId = '';
    }

}