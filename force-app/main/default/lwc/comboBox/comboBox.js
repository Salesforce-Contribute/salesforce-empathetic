import { LightningElement } from 'lwc';

export default class ComboBox extends LightningElement {

    
    recordList = [
        {
            "id":1,
            "name":"John",
            "icon":"Icon 1",
            "subfield":"Sub 1"
        },
        {
            "id":2,
            "name":"Deo",
            "icon":"Icon 2",
            "subfield":"Sub 2"
        },
        {
            "id":3,
            "name":"Daniel",
            "icon":"Icon 3",
            "subfield":"Sub 3"
        },
    ];

    isValueSelected = false;
    isRequired = false;
    searchString = "";
    selectedIconName = "standard:account";
    preventClosingOfSerachPanel = false;

    get isValueSelected(){
        return true;
    }

    get showRecord(){
        if(!this.recordList){
            return false;
        }

        return this.recordList;
    }

    get methodInput(){
        return {
            searchString : this.searchString 
        }
    }

    handleChange(event){
        this.searchString = event.target.value;

        
    }
    handleBlur(){
        alert('handleBlur()')
    }

    handleDivClick(){
        alert('handleDivClick()')
    }

    handleInputBlur(){
        alert('handleInputBlur')
        // window.clearTimeout(this.delayTimeOut);

        // this.delayTimeOut = setTimeout(()=>{
        //     if(!this.preventClosingOfSerachPanel){
        //         this.recordList = [];
        //     }
        //     this.preventClosingOfSerachPanel = false;
        // }, DELAY)
    }
}