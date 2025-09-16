import { LightningElement, api, track, wire } from 'lwc';
import MyModal from 'c/myModal';
import getContacts from '@salesforce/apex/DatatableController.getContacts';
import getContactList from '@salesforce/apex/DatatableController.getContactList';
import getLeads from '@salesforce/apex/DatatableController.getLeads';
import getLeadsForWired from '@salesforce/apex/DatatableController.getLeadsForWired';
import getOppportunitiesForWired from '@salesforce/apex/DatatableController.getOppportunitiesForWired';
import getSearchLead from '@salesforce/apex/DatatableController.getSearchLead';
import getOppportunities from '@salesforce/apex/DatatableController.getOppportunities';
import getAccounts from '@salesforce/apex/DatatableController.getAccounts';
import testApexError from '@salesforce/apex/DatatableController.testApexError';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { reduceErrors } from "c/ldsUtils";
import Toast from 'lightning/toast';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import Lead_ID_FIELD from '@salesforce/schema/Lead.Id';
import Opp_ID_FIELD from '@salesforce/schema/Opportunity.Id';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;

export default class CallMultipleFunction extends LightningElement {

    searchKey = "";
    opportunities;
    accounts;
    error;
    leads;

    //Use for Complex paratmers
    listItemValue = 0;
    numberValue = 50;
    stringValue = "Some string";

    //This is complex parameter
    parameterObject = {
        someString: this.stringValue,
        someInteger: this.numberValue,
        someList: [],
    };
    
    idOne;
    idTwo;
    //Wire an Apex Method to a Property
    // @wire(getLeads)
    // leads;

    //Wire an Apex Method with a Dynamic Parameter with property
    @wire(getSearchLead, {searchKey:"$searchKey"})
    leads;

    //Wire an Apex Method with a Dynamic Parameter with function
    /*@wire(getSearchLead, {searchKey:"$searchKey"})
    wireLeadSearch({ error, data }) {
        if (data) {
            this.leads = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.leads = undefined;
        }
    }*/


    //Wire an Apex Method to a Function 
    @wire(getOppportunities)
    wireOpportunities({ error, data }) {
        if (data) {
            this.opportunities = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.opportunities = undefined;
        }
    }

    @wire(getRecord, {fields: [Lead_ID_FIELD, Opp_ID_FIELD]})
    wiredGetRecord(value){
        const {data, error} = value;
        if(data) {
            console.log('wired getRecord: '+ Lead_ID_FIELD, Opp_ID_FIELD);
            this.idOne = Lead_ID_FIELD;
            this.idTwo = Opp_ID_FIELD;
        } else {
            // console.log('wired getRecord error: '+ error);
        }
    }
    
    leadActivities;
    @wire(getLeadsForWired, { leadId: '$idOne'})
    wiredGetLeads(value) {
        this.leadActivities = value; 
        const { data, error } = value; 
        if (data) {
            console.log('data getLeadsForWired:'+ data);
        }
        else if (error) {
            console.log('getLeadsForWired error:'+ error);
        }
    }

    oppActivities
    @wire(getOppportunitiesForWired, { oppId: '$recordId'})
    wiredGetOpportunity(value) {
        this.oppActivities = value; 
        const { data, error } = value; 
        if (data) {
            console.log('data getOppportunitiesForWired:'+ data);
        }
        else if (error) {
            console.log('getOppportunitiesForWired error:'+ error);
        }
    }

    handleKeyChange(event){
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(()=>{
            this.searchKey = searchKey;
        }, DELAY)
    }


    //Wire an Apex Method with Complex Parameters 
    // @wire(checkApexTypes, { wrapper: "$parameterObject" })
    // apexResponse;

    //Open new modal
    @track objectContainer = {recordId:"0012w00001R6qgkAAB", objectApiName:"Account", fields:["Name", "Phone", "Website", "Amount", "Type"]};
    @track options=[
        {label: 'Apple', value:'Apple'},
        {label: 'Banana', value:'Banana'},
        {label: 'Orange', value:'Orange'},
        {label: 'Mango', value:'Mango'},
    ]
    
    handleClick() {
        MyModal.open({
            label: 'Standard modal',
            size: 'small',
            description: 'Accessible description of modal\'s purpose',
            comboboxOptions: this.options,
            onsave: (e) => {
                //stop further propagation of the event
                e.stopPropagation();
                this.handleSave(e.detail);
           }
        })
    }

    handleSave(detail) {
        const { userName, selectedFruit } = detail;
        console.log(`Your name is ${userName} and favorite fruit is ${selectedFruit}`);
    }

    handleApexSearchImperatively() {
        getAccounts({ searchKey: this.searchKey })
        .then((result) => {
            this.accounts = result;
            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
            this.accounts = undefined;
        });
    }
    

    async handleMultiApexMethod() {
        // getContacts()
        // .then((res)=>{
        //     console.log('Success getContacts');
        // })
        // .catch((err)=>{
        //     console.log('Error getContacts');
        // })

        // getContactList()
        // .then((res)=>{
        //     console.log('Success getContactList');
        // })
        // .catch((err)=>{
        //     console.log('Error getContactList');
        // })

        // getLeads()
        // .then((res)=>{
        //     console.log('Success getLeads');
        // })
        // .catch((err)=>{
        //     console.log('Error getLeads');
        // })

        // getOppportunities()
        // .then((res)=>{
        //     console.log('Success getOppportunities');
        // })
        // .catch((err)=>{
        //     console.log('Error getOppportunities');
        // })
        try {
            let result1 = await getContacts();
            if(result1) {
                console.log('result1: '+result1)
            }
            
            let result2 = await getContactList()
            if(result2) {
                console.log('result2: '+ result2)
            }

            let result3 = await getLeads()
            if(result3) {
                console.log('result3: '+ result3)
            }

            let result4 = await getOppportunities()
            if(result4) {
                console.log('result4: '+ result4)
            }
        } catch (error) {
            console.log('Error'+ JSON.stringify(error));
        }
        
    }

    /*handleOkay() {
        this.close('okay');
    }*/

    testError() {
        try{
            if(8 < 7) {
                throw new Error("Something has gone wrong!");
            }
            testApexError()
            .then((response)=>{
                this.toastMessage("Test success", response, "success");
            })
            .catch((error)=>{
                this.toastMessage("Test error1", error, "error");
            })

        } catch(error) {
            this.toastMessage("Test error2", error, "error");
        }
    }
    
    toastMessage(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
              title: title,
              message: reduceErrors(message).join(", "),
              variant: variant,
            }),
        );
    }


    testToast() {
        Toast.show({
            label: 'This is a toast label which shows {0}, you can learn more about its accessibility from {1}',
            labelLinks : [{
                url: 'https://www.lightningdesignsystem.com/components/toast/',
                label: 'LDS link'
            }, {
                url: 'https://www.lightningdesignsystem.com/accessibility/guidelines/global-focus/#toasts',
                label: 'toast guideline'
            }],
            message: 'I want to show a {salesforceLink} and a {slackLink}',
            messageLinks: {
                salesforceLink: {
                    url: 'http://www.salesforce.com',
                    label: 'Salesforce link'
                },
                slackLink: {
                    url: 'https://slack.com',
                    label: 'Slack link'
                }
            },
            mode: 'sticky',
            variant: 'info'
        }, this);
    }
}