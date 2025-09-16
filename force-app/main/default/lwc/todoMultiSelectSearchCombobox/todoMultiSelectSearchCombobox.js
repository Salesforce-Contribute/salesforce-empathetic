import { LightningElement, api } from 'lwc';

const DELAY = 300;
export default class TodoMultiSelectSearchCombobox extends LightningElement {

    @api options;
    @api picklistlabel;
    searchValue='';
    copyData = [];
    originalOptions = [];
    showdropdown = false;
    delayTimeout;
    selectedvalues = [];
    _receivedOptData;
    ismore=false;
    showMoreClass = 'slds-listbox_selection-group';

    @api
    set recievedOption(value) {
        this._receivedOptData = value;
        this.copyData = JSON.parse(JSON.stringify(this._receivedOptData));
        this.originalOptions = JSON.parse(JSON.stringify(this._receivedOptData));
    }
    
    get recievedOption() {
        return this._receivedOptData;
    }

    get isOptAvl() {
        return this.selectedvalues.length > 0 ? true : false;
    }

    get selectedSize() {
        let size = this.selectedvalues.length > 0 ? `${this.selectedvalues.length}` : '';
        return size;
    }

    get buttonLabel() {
        let label = this.ismore ? 'Close' : 'View';
        return label;
    }

    handleleave() {   
        console.log('handlelevae-------')
        let sddcheck= this.showdropdown;
        this.searchSelected();
        if(sddcheck){
            this.showdropdown = false;            
        }
    }

    handleShowdropdown(){
        let sdd = this.showdropdown;
        if(sdd){
            this.showdropdown = false;
        }else{
            this.showdropdown = true;
        }
    }

    handleSelected(event) {
        const selected = event.target.selected;
        const selectedItem = event.target.label;
        if(selected) {
            this.template.querySelectorAll('c-picklist-value').forEach(
                element => {
                    if(element.selected){
                        this.selectedvalues.push(element.label);
                    }
                }
            );
            const picklistvalues = this.options.map(eachvalue => ({...eachvalue}));
            picklistvalues.forEach((element, index) => {
                if(this.selectedvalues.includes(element.label)){
                    picklistvalues[index].selected = true;
                }else{
                    picklistvalues[index].selected = false;
                }
            });
            this.options = picklistvalues;
            this.copyData = picklistvalues;
            this.selectedvalues = [...new Set(this.selectedvalues)];
        } else {
            this.selectedvalues = [...new Set(this.selectedvalues)];
            this.selectedvalues = this.selectedvalues.filter(item => item !== selectedItem);
        }      
    }


    keyupOptionsHandler(event) {
        window.clearTimeout(this.delayTimeout);
        this.searchValue = event.target.value;
        if(this.searchValue.length > 0) {
            this.showdropdown = true;
            this.delayTimeout = setTimeout(() => {
                this.options = this.copyData.filter(item => item.label.toLowerCase().includes(this.searchValue.toLowerCase()));
            }, DELAY);
        }
    }

    focusIn() {
        const selectedVal = [...new Set(this.selectedvalues)];
        this.originalOptions.forEach((element, index) => {
            if(selectedVal.includes(element.label)){
                this.originalOptions[index].selected = true;
            }else{
                this.originalOptions[index].selected = false;
            }
        });
        this.options = this.originalOptions;
        this.copyData = JSON.parse(JSON.stringify(this.originalOptions));
    }

    changeOptionsHandler(event) {
        this.searchValue = event.target.value;
        if(this.searchValue.length == 0) {
            const selectedVal = [...new Set(this.selectedvalues)];
            this.originalOptions.forEach((element, index) => {
                if(selectedVal.includes(element.label)){
                    this.originalOptions[index].selected = true;
                }else{
                    this.originalOptions[index].selected = false;
                }
            });
            this.options = this.originalOptions;
        }
    }

    searchSelected() {
        this.showdropdown = false;
        const selectedVal = [...new Set(this.selectedvalues)];
        const searchEvent = new CustomEvent('multiselectsearchlookup', {
            detail: {selectedvalues: selectedVal}
        }) 
        this.dispatchEvent(searchEvent);
    }

    disiplayMore() {
        this.ismore = this.ismore == false ? true : false;
        this.showMoreClass = this.ismore ? 'slds-listbox_selection-group slds-is-expanded' : 'slds-listbox_selection-group';
    }

    closePill(event) {
        const removeItem = event.target.dataset.selectedValue;
        this.selectedvalues = [...new Set(this.selectedvalues)];
        this.selectedvalues = this.selectedvalues.filter(item => item !== removeItem);
        this.handleleave();
    }

    @api
    clearSearchField() {
        this.searchValue = '';
        this.selectedvalues = [];
    }
}