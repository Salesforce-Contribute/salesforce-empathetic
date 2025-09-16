import { LightningElement, api} from 'lwc';
import fetchRecords from '@salesforce/apex/comoboboxAndTableQuickActionController.fetchRecords';

const DELAY = 500;

export default class ComboxAndTableQuickAction extends LightningElement {
    @api recordId;
    @api helpText = "Help text";
    @api label = "Choose Opportunity";
    @api required;
    @api selectedIconName = "standard:opportunity";
    @api objectLabel = "Choose Opportunity";
    recordsList = [];
    selectedRecordName;

    @api objectApiName = "Opportunity";
    @api fieldApiName = "Name";
    @api searchString = "";
    @api selectedRecordId = "";

    preventClosingOfSerachPanel = false;

    get methodInput() {
        return {
            objectApiName: this.objectApiName,
            fieldApiName: this.fieldApiName,
            searchString: this.searchString,
            selectedRecordId: this.selectedRecordId,
        };
    }
    get showRecentRecords() {
        if (!this.recordsList) {
            return false;
        }
        return this.recordsList.length > 0;
    }

    connectedCallback() {
        if (this.selectedRecordId) {
            this.fetchSobjectRecords(true);
        }
    }

    fetchSobjectRecords(loadEvent) {
        fetchRecords({
            inputWrapper: this.methodInput
        }).then(result => {
            if (loadEvent && result) {
                console.log('==========', result[0].mainField);
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

    handleChange(event) {
        this.searchString = event.target.value;
        this.fetchSobjectRecords(false);
    }

    handleBlur() {
        this.recordsList = [];
        this.preventClosingOfSerachPanel = false;
    }

    handleDivClick() {
        this.preventClosingOfSerachPanel = true;
    }

    handleCommit() {
        this.selectedRecordId = "";
        this.selectedRecordName = "";
    }

    handleSelect(event) {
        let selectedRecord = {
            mainField: event.currentTarget.dataset.mainfield,
            subField: event.currentTarget.dataset.subfield,
            id: event.currentTarget.dataset.id
        };
        this.selectedRecordId = selectedRecord.id;
        this.selectedRecordName = selectedRecord.mainField;
        this.recordsList = [];
    }

    handleInputBlur(event) {
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            if (!this.preventClosingOfSerachPanel) {
                this.recordsList = [];
            }
            this.preventClosingOfSerachPanel = false;
        }, DELAY);
    }
 
    @api
    getTransId()
    {
        console.log('getTransId');
        const selectedEvent = new CustomEvent('valueselected', {
            detail: this.selectedRecordId
        });
        //dispatching the custom event
        this.dispatchEvent(selectedEvent);
    }  
}