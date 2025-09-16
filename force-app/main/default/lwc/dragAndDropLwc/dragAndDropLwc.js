import { LightningElement, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity'
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName'
import ID_FIELD from '@salesforce/schema/Opportunity.Id'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import DragAndDropCtrl from '@salesforce/apex/DragAndDropCtrl.getOpportunity'

export default class DragAndDropLwc extends LightningElement {
    records
    pickVals
    recordId


    /*** fetching Opportunity lists ***/
    /*@wire(getListUi, {
        objectApiName: OPPORTUNITY_OBJECT,
        listViewApiName:'AllOpportunities'
    })wiredListView({error, data}){
        if(data){
            // console.log("getListUi", JSON.stringify(data.records.records))
            this.records = data.records.records.map((item) => {
                console.log('1');
                let field = item.fields
                console.log('2');
                let account = field.Account.value.fields
                console.log('3');
                return { 'Id': field.Id.value, 'Name': field.Name.value, 'AccountId': account.Id.value, 'AccountName': account.Name.value, 'CloseDate': field.CloseDate.value, 'StageName': field.StageName.value, 'Amount': field.Amount.value }

            })
            // console.log("records:", JSON.stringify(this.records))
        }
        if(error){
            console.error(error)
        }
    }*/

    wireDataActivity;
    @wire(DragAndDropCtrl) 
    wiredOpportunity(value){
        this.wireDataActivity = value;
        const {data, error} = value;
        if(data){
            this.records = data;
        }
        else if(error) {
            console.log(error);
        }
    }
    

/** Fetch metadata abaout the opportunity object**/
@wire(getObjectInfo, {objectApiName:OPPORTUNITY_OBJECT})
objectInfo
/*** fetching Stage Picklist ***/

    @wire(getPicklistValues, {
        recordTypeId:'$objectInfo.data.defaultRecordTypeId',
        fieldApiName:STAGE_FIELD
    })stagePicklistValues({ data, error}){
        if(data){
            console.log("Stage Picklist", data)
            this.pickVals = data.values.map(item => item.value)
        }
        if(error){
            console.error(error)
        }
    }


    /****getter to calculate the  width dynamically*/
    get calcWidth(){
        let len = this.pickVals.length +1
        return `width: calc(100vw/ ${len})`
    }

    handleListItemDrag(event){
        this.recordId = event.detail
    }

    handleItemDrop(event){
        let stage = event.detail
        // this.records = this.records.map(item=>{
        //     return item.Id === this.recordId ? {...item, StageName:stage}:{...item}
        // })
        this.updateHandler(stage)
    }
    
    updateHandler(stage){
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[STAGE_FIELD.fieldApiName] = stage;
        const recordInput ={fields}
        updateRecord(recordInput)
        .then(()=>{
            console.log("Updated Successfully")
            this.showToast()
            refreshApex(this.wireDataActivity);
            // return refreshApex(this.wiredListView)
        }).catch(error=>{
            console.error(error)
        })
    }

    showToast(){
        this.dispatchEvent(
            new ShowToastEvent({
                title:'Success',
                message:'Stage updated Successfully',
                variant:'success'
            })
        )
    }
}