import { LightningElement, wire} from 'lwc';
import getAccList from '@salesforce/apex/SaveCheckboxValuesController.getAccounts';

export default class SaveCheckboxValues extends LightningElement {

    selectedAccounts = [];
    accList;
    @wire(getAccList)
    wiredRecord({ error, data }) {
      if (error) {
        let message = "Unknown error";
        if (Array.isArray(error.body)) {
          message = error.body.map((e) => e.message).join(", ");
        } else if (typeof error.body.message === "string") {
          message = error.body.message;
        }
      } else if (data) {
        this.accList = JSON.parse(data);
      }
    }
    handleAllChange(event) {
      for (var i = 0; i < this.accList.length; i++) {
        this.accList[i].isSelected = event.target.checked;
      }
    }
    handleCheckChange(event) {
      this.accList[event.target.value].isSelected = event.target.checked;
    }
    getSelectedAccounts(event) {
     //enter image description here
     console.log(recordId, fieldName, fieldValue);
      for (var i = 0; i < this.accList.length; i++) {
        if (this.accList[i].isSelected) {
          this.selectedAccounts.push(this.accList[i]);
      }
    }
    
      console.log("###Selected Accounts" + this.selectedAccounts.length);
      console.log("###Stringify : " + JSON.stringify(this.selectedAccounts));
    }
  
}