import { LightningElement, wire } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import NewStandardModal from 'c/newStandardModal';

export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;
    url;

    @wire(CurrentPageReference)
    pageDetail(pageRef) {
        console.log(pageRef);
        this.url = pageRef;
    }

    connectedCallback() {
        
    }

    renderedCallback() {
        // console.log('page: '+ JSON.stringify(this.url))
    }

    handleLoading() {
        console.log('----handleLoading-----')
        this.isLoading = true;
    }

    handleDoneLoading() {
        console.log('----handleDoneLoading-----')
        this.isLoading = false;
    }

    searchBoats(event) {
        let boatTypeId = event.detail.boatTypeId;
        this.template.querySelector('c-boat-search-result').searchBoatResult(boatTypeId);
        this.handleDoneLoading();
    }

    createNewBoat() {
        // this[NavigationMixin.Navigate]({
        //     type: 'standard__objectPage',
        //     attributes: {
        //         objectApiName: 'Boat__c',
        //         actionName: 'new'
        //     }
        // });  

        NewStandardModal.open({
            header:'New Boat',
            size: "small",
            description: "This is a small modal",
            
        })
        .then((res)=>{
            console.log('THES TEHST')
        })
    }
}