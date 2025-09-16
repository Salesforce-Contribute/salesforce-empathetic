import { LightningElement, track, api, wire } from 'lwc';
import { FlowNavigationFinishEvent } from 'lightning/flowSupport';
import getContactsForFlow from '@salesforce/apex/DatatableController.getContactsForFlow';

export default class ScreenFlowForm extends LightningElement {

    @track dataobject = {username:"", "toggleList":[], isMale:false, isFemale:false, isOther:false};
    value = '';
    @api availableActions = [];

    @api username;
    @api userListCollection = [];
    @api gender;

    @track wrapperList = [];


    get options() {
        return [
            { label: 'Sales', value: '1' },
            { label: 'Force', value: '2' },
            { label: 'Flow', value:'3' }
        ];
    }

    get isFinishAction() {
        return this.availableActions.includes('FINISH')
    }

    connectedCallback() {
        if(sessionStorage.getItem("dataobject")) {
            console.log("if => sessionStorage.getItem()");
            let sessionItems = JSON.parse(sessionStorage.getItem("dataobject"));
            Object.assign(this.dataobject, sessionItems);   
        }
    }

    @wire(getContactsForFlow)
    wiredGetContactsForFlow(value) {
        const {data, error} = value;
        if(data) {
            this.wrapperList = data;
            if(sessionStorage.getItem("dataobject")==null){
                this.dataobject.toggleList = this.wrapperList.map((item, index) => {
                    return {...item, isSelected:false}
                })
                console.log("wired sessionStorage.setItem()")
                sessionStorage.setItem("dataobject", JSON.stringify(this.dataobject));
            }
        }
    }

    handleInput(event) {
        let value = event.target.value;
        this.dataobject.username = value;
        sessionStorage.setItem("dataobject", JSON.stringify(this.dataobject));
    }

    handleToggle(event) {
        let value = event.target.checked;
        let label = event.target.label; 
        console.log('value: ', label, value);
        this.dataobject.toggleList.forEach((element)=>{
            if(element.Email == label) element.isSelected=value;
        })
        sessionStorage.setItem("dataobject", JSON.stringify(this.dataobject));

    }

    handleIsMale(){
        this.dataobject.isMale=true;
        this.dataobject.isFemale=false;
        this.dataobject.isOther=false;
        sessionStorage.setItem("dataobject", JSON.stringify(this.dataobject))
    }

    handleIsFemale(){
        this.dataobject.isMale=false;
        this.dataobject.isFemale=true;
        this.dataobject.isOther=false;
        sessionStorage.setItem("dataobject", JSON.stringify(this.dataobject))
    }
    handleIsOther(){
        this.dataobject.isMale=false;
        this.dataobject.isFemale=false;
        this.dataobject.isOther=true;
        sessionStorage.setItem("dataobject", JSON.stringify(this.dataobject))
    }
    
    @api
    validate() {
        var errorMsg = "";
        var checkedValidation = true;
        var sessionsStorage = JSON.parse(sessionStorage.getItem("dataobject"));
        console.log("sessionstorage:===>"+ JSON.stringify(sessionsStorage));
        let userSelected = false;
        sessionsStorage.toggleList.forEach((item)=>{
            for(let i=0; i<sessionsStorage.toggleList.length; i++){
                if(item.isSelected == true){
                    userSelected = true;
                }
            }
        })
        
        if(sessionsStorage.username == "") {
            errorMsg = "Enter user name";
            checkedValidation = false;
        }
        else if(!userSelected) {
            errorMsg = "Please selecte at least one user";
            checkedValidation = false;
        }
        else if(sessionsStorage.isMale==false && sessionsStorage.isFemale==false && sessionsStorage.isOther==false) {
            errorMsg = "Select gender";
            checkedValidation = false;
        }
        else {
            checkedValidation = true;
        }

        if(checkedValidation) {
            //handleFlowData();
            return { isValid: true };
            }
        else {
            // If the component is invalid, return the isValid parameter
            // as false and return an error message.
            return {
                isValid: false,
                errorMessage: errorMsg
            };
        }
    }

    handleFlowData() {
        let sessionsStorage = JSON.parse(sessionStorage.getItem("dataobject"));
        this.username = sessionsStorage.username;
        console.log('username: '+this.username);
        const dispatch_user = new FlowAttributeChangeEvent("username", this.username);
        this.dispatchEvent(dispatch_user);

        this.userListCollection = sessionsStorage.toggleList;
        console.log('list: '+ this.userListCollection);
        const dispatch_userList = new FlowAttributeChangeEvent("userListCollection", this.userListCollection);
        this.dispatchEvent(dispatch_userList);

        if(sessionsStorage.isMale){
            this.gender = "Male";
            var dispatch_gender = new FlowAttributeChangeEvent("gender", this.gender);
        }
        else if(sessionsStorage.isFemale) {
            this.gender = "Female";
            var dispatch_gender = new FlowAttributeChangeEvent("gender", this.gender);
        }
        else if(sessionsStorage.isOther) {
            this.gender = "Other";
            var dispatch_gender = new FlowAttributeChangeEvent("gender", this.gender);
        };
        this.dispatchEvent(dispatch_gender);
    }

    closeFlow(){
        const finishEvent = new FlowNavigationFinishEvent();
        this.dispatchEvent(finishEvent);
        console.log("fow finish event dispatched");
    }
}