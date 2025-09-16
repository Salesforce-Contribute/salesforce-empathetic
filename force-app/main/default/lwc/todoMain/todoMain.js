import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import { updateRecord } from 'lightning/uiRecordApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity'
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName'
import ID_FIELD from '@salesforce/schema/Opportunity.Id'
import getData from '@salesforce/apex/DragAndDropCtrl.getOpportunity'

export default class TodoMain extends LightningElement {
  
  todoDataList = [];
  originalData = [];
  copyData = [];
  totalTodoSize=0;
  
  isLoading = false;

  state=[]

  @wire(getObjectInfo, {objectApiName:OPPORTUNITY_OBJECT})
  objectInfo;

  @wire(getPicklistValues, {recordTypeId:'$objectInfo.data.defaultRecordTypeId',fieldApiName:STAGE_FIELD})
  stagePicklistValues({ data, error}){
      if(data){
        this.state = data.values.map(item => item.value)
        console.log('Total state: '+ this.state.length);
      }
      if(error){
          console.error(error)
      }
  }

  connectedCallback() {
    this.handleLoading();
    getData()
    .then((res)=> {
      this.todoDataList = res;
      this.totalTodoSize = this.todoDataList.length;
      console.log('Total rec: '+ this.totalTodoSize);
      // this.categoryByState();
      this.copyData = JSON.parse(JSON.stringify(this.todoDataList));
      this.originalData = JSON.parse(JSON.stringify(this.todoDataList));
      this.handleDoneLoading();
    })
    .catch((error) => {
      this.showToast('Error', error.body.message, 'error');
      this.handleDoneLoading();
    })
    
  }

  handleListItemDrag(event){
    this.recordId = event.detail
    console.log('recordId: '+ this.recordId);
  }

  handleItemDrop(event){
    let stage = event.detail
    // this.records = this.records.map(item=>{
    //     return item.Id === this.recordId ? {...item, StageName:stage}:{...item}
    // })
    this.updateHandler(stage);
  }

  updateHandler(stage) {
    const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[STAGE_FIELD.fieldApiName] = stage;
        const recordInput ={fields}
        console.log('updateinput: '+ JSON.stringify(recordInput));
        updateRecord(recordInput)
        .then(()=>{
            console.log("Updated Successfully")
            this.connectedCallback();
        }).catch(error=>{
            console.error(error)
        })
  }
  

  handleLoading() {
    this.isLoading = true;
  }

  handleDoneLoading() {
    this.isLoading = false;
  }

  showToast(title, message, variant) {
    const showToast = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
    });
    this.dispatchEvent(showToast);
  }
}