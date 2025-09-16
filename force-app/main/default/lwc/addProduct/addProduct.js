import { LightningElement, track, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import retrieveProducts from '@salesforce/apex/AddProductController.retrieveProducts';
import retrieveOpportunityLineItem from '@salesforce/apex/AddProductController.retrieveOpportunityLineItem';
import updateProducts from '@salesforce/apex/AddProductController.updateProducts';
import searchProducts from '@salesforce/apex/AddProductController.searchProducts';
import filterApply from '@salesforce/apex/AddProductController.filterApply';

export default class AddProduct extends LightningElement {

    bool = true;
    nextBool = true;
    backBool = false;
    allChecks=false;
    showViewAll = false;
    viewSelected = false;
    showBackToSearch=false;
    manageShowCount = true;
    showCount = false;
    filterBox=false;
    showFilterBoxFooter = false;
    keepSelected;
    selectedItem=[];
    rowCheck;
    optionCheckMaintain=[];
    @track options = [{id:1, opt:'A'}, {id:2, opt:'B'}, {id:3, opt:'C'}, {id:4, opt:'D'}];
    @track isShowModal = false;
    @track count=0;
    @track searchKey='';
    @track filterSearchKey='';
    @track dataList;
    @track itemList;
    @track searchData;
    @track selectedList;
    
    
    

    connectedCallback(){
        this.fetchProducts(); 
    }

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.nextBool = true;
        this.showFilterBoxFooter = false;
        this.backBool = false;
        this.showCount = false;
        this.count = 0;
        this.showViewAll = false;
        this.viewSelected = false;
        //deselect the selected row
        this.itemList.forEach((ele)=>{
            ele.isSelected = false
        })
        this.isShowModal = false;
    }


    fetchProducts() {
        retrieveProducts()
        .then(results=>{
            this.itemList = JSON.parse(results);
            this.dataList = this.itemList;
        }) 
        .catch(error=>{
            this.error = error;
            this.dataList = undefined;
            console.log('Result error:', error.body.message);
        })
    }
    
    showFilterBox(){
        this.filterBox = !this.filterBox;
        if(this.filterBox){
            const table = this.template.querySelector('[data-id="col-table"]');
            table.removeAttribute('class', 'slds-col slds-size_12-of-12');
            table.setAttribute('class', 'slds-col slds-size_8-of-12');
            const filter = this.template.querySelector('[data-id="col-filter"]');
            filter.setAttribute('class', 'slds-col slds-size_4-of-12');
        } else {
            const table = this.template.querySelector('[data-id="col-table"]');
            table.setAttribute('class', 'slds-col slds-size_12-of-12');
            const filter = this.template.querySelector('[data-id="col-filter"]');
            filter.setAttribute('class', 'slds-col slds-size_0-of-12');
        }
    }

    hideFilterBox(){
        this.filterBox=false;
        const table = this.template.querySelector('[data-id="col-table"]');
        table.setAttribute('class', 'slds-col slds-size_12-of-12');
        const filter = this.template.querySelector('[data-id="col-filter"]');
        filter.setAttribute('class', 'slds-col slds-size_0-of-12');
    }

    filterInput(event){
        this.filterSearchKey = event.target.value;
        if(this.filterSearchKey.length != 0 ){
            this.showFilterBoxFooter = true;
        } else {
            this.showFilterBoxFooter = false;
        }
    }

    optionsFilter(event) {
        const id = event.target.dataset.optionId;
        const checked = event.target.checked;
        
        if(checked===true){
            const value = this.optionCheckMaintain.indexOf(id);
            if(value == -1){
                this.optionCheckMaintain.push({id:id, check:checked});
            }
        } 
    
        if(checked===false) {
            this.optionCheckMaintain.filter((item, index)=>{
                if(item.id===id){
                    this.optionCheckMaintain.splice(index, 1);
                }
            })
            
        }
        
        let boolArray = this.optionCheckMaintain.map((c)=>{
            return c.check;
        })
        
        const bools = JSON.stringify(boolArray);
        const boolChange = bools.includes(true);
        this.showFilterBoxFooter = boolChange;

    }

    

    filterApplyHandler(){
        filterApply({filterKey: this.filterSearchKey})
            .then(results=>{
                this.searchData = JSON.parse(results);
                this.itemList.forEach((ele)=>{
                    this.searchData.forEach((search)=>{
                        if(ele.isSelected===true && ele.Id===search.Id)
                            search.isSelected=ele.isSelected;
                    })
                })
                this.dataList = this.searchData;
                this.showBackToSearch = true;
                
                this.showViewAll=false;
                this.manageShowCount=false;
                this.viewSelected=false;
            }) 
            .catch(error=>{
                this.error = error;
                this.dataList = undefined;
                console.log('Applyfilter error:', error.body.message);
            })
            this.backHandler();
    }

    cancleHandler() {
        this.filterSearchKey = '';
        this.optionCheckMaintain.forEach((op)=>{
            this.template.querySelector(`[data-option-id="${op.id}"]`).checked = false;
        })
        this.showFilterBoxFooter = false;
    }

    closeModal() {
        this.isShowModal = false;
    }

    filterProducts(event){
        this.searchKey = event.target.value;
        const keyCode = event.keyCode;
        
        if(keyCode==13 && this.searchKey.length != 0){
            this.showViewAll = false;
            searchProducts({searchkey: this.searchKey})
            .then(results=>{
                this.searchData = JSON.parse(results);
                
                this.itemList.forEach((ele)=>{
                    this.searchData.forEach((search)=>{
                        if(ele.isSelected===true && ele.Id===search.Id)
                            search.isSelected=ele.isSelected;
                    })
                })
                this.dataList = this.searchData;
                // console.log('search:', JSON.stringify(this.searchData));
                this.showBackToSearch = true;
                
                this.showViewAll=false;
                this.manageShowCount=false;
                this.viewSelected=false;
            }) 
            .catch(error=>{
                this.error = error;
                this.dataList = undefined;
                console.log('filter error:', error.body.message);
            })
            this.backHandler();
        }

        if(keyCode==8 && this.searchKey.length==0){
            console.log('search---', JSON.stringify(this.searchData));
            this.backToSearchHandler();
        }
    }

    backToSearchHandler(){
        this.itemList.forEach((ele)=>{
            this.searchData.forEach((search)=>{
                if(search.isSelected===false && search.Id===ele.Id)
                    ele.isSelected=search.isSelected;
                if(search.isSelected===true && search.Id===ele.Id)
                    ele.isSelected=search.isSelected;
            })
        })  

        this.dataList = this.itemList;
        this.showViewAll = false;
        this.showBackToSearch = false;
        this.manageShowCount = true;
    }

    viewAllHandler(){
        this.manageShowCount = true;
        this.showViewAll = false;
        this.viewSelected = true;
        if(!this.showViewAll){
            this.searchKey = '';
        }
        this.dataList = this.itemList;
    } 

    viewSelecteHandler(){
        this.manageShowCount = false;
        this.dataList = this.itemList.filter((ele)=>{
            return ele.isSelected===true;
        })
        this.viewSelected=false;
        this.showViewAll=true;
    }

    selectAllHandler(event){
        this.allChecks = event.target.checked;
        this.keepSelected = this.template.querySelector('[data-id="headerCheck"]');
        this.keepSelected = this.allChecks;

        if(this.allChecks === true){
           
            this.dataList.filter((ele)=>{
                if(ele.isSelected !== true){
                    ele.isSelected = this.allChecks;
                    this.selectedItem.push({id:ele.Id, check:this.allChecks});
                    this.count = this.count + 1;
                }
            })
            if(this.count>0){
                this.bool = !this.allChecks;
           
            }
        }
        if(this.allChecks === false){
            this.bool = !this.allChecks;
            this.dataList.forEach((ele)=>{
                ele.isSelected = this.allChecks;
                this.selectedItem.pop();
                this.count = this.count - 1;
            })
        }

        if(!this.keepSelected){
            this.count=0;
            this.manageShowCount = true;
            this.showCount = false;
        }

        if(this.keepSelected){
            this.showCount = true;
        }
    }

    selectHandler(event){
        const id = event.target.dataset.checkId;
        const checked = event.target.checked; 
       
        if(checked===true){
            const value = this.selectedItem.indexOf(id);
            if(value == -1){
                this.selectedItem.push({id:id, check:checked});
                this.count = this.count + 1;
            }
        } 
    
        if(checked===false) {
            this.selectedItem.filter((item, index)=>{
                if(item.id===id){
                    this.selectedItem.splice(index, 1)
                    this.count = this.count - 1;
                }
            })
            
        }
        
        let boolArray = this.selectedItem.map((c)=>{
            return c.check
        })
        
        const bools = JSON.stringify(boolArray)
        const boolChange = bools.includes(true)
        this.bool = !boolChange   

        // !this.bool ? this.viewSelected=true : this.viewSelected=false;
    
        if(!this.bool){
            this.viewSelected=true;
            this.showCount=true;
        } else {
            this.viewSelected=false;
            this.showCount=false;
        }
        this.dataList.forEach(element => {
            if(element.Id===id){
                element.isSelected = checked;
            }
        });       
    }

    backHandler(){      
        this.backBool = false;
        this.nextBool = true;
    }

    async nextHandler(){
        this.hideFilterBox()
        let recordIds='';
        console.log('NextHandler=====>');
        console.log('storeCheck:', this.selectedItem.length);
        this.selectedItem.forEach((ele)=>{
            recordIds += ele.id+',';
        })
        
        if(recordIds.length > 0){

            this.nextBool = false;
            this.backBool = true;
            try{
                console.log('Ids:', recordIds);
                const response = await retrieveOpportunityLineItem({fetchIds:recordIds})
                console.log('Response:', JSON.stringify(response));
                this.selectedList = response;
            } catch(error) {
                alert(`${error.statusText} \n${error.body.message} `);
            } 
        }
    }

    deleteHandler(event){
        const id = event.currentTarget.dataset.pricebookentryId;
        console.log('ID:', id);
        this.selectedList.forEach((ele, index)=>{
            if(ele.PricebookEntryId===id){
                this.selectedList.splice(index, 1);
            }
        })
    }

    onChangeQuantity(event){
        let key = event.currentTarget.dataset.targetId
        let quantity = event.target.value;
        console.log(key, quantity);
        const index = this.selectedList.findIndex((x)=> {
            return x.PricebookEntryId===key
        });
        this.selectedList[index].quantity = quantity;
    }

    onChangeSalesprice(event){
        let key = event.currentTarget.dataset.targetId
        let salesprice = event.target.value;
        console.log(key, salesprice);
        const index = this.selectedList.findIndex((x)=> {
            return x.PricebookEntryId===key
        });
        this.selectedList[index].salesPrice = salesprice;
    }

    onChangeServiceDate(event){
        let key = event.currentTarget.dataset.targetId
        let serviceDate = event.target.value;
        console.log(key, serviceDate);
        const index = this.selectedList.findIndex((x)=> {
            return x.PricebookEntryId===key
        });
        this.selectedList[index].serviceDate = serviceDate;
    }

    onChangeLineDescription(event){
        let key = event.currentTarget.dataset.targetId
        let lineDescription = event.target.value;
        console.log(key, lineDescription);
        const index = this.selectedList.findIndex((x)=> {
            return x.PricebookEntryId===key
        });
        this.selectedList[index].lineDescription = lineDescription;
    }

    async saveHandler(){
        
        try{
            const response = await updateProducts({data:this.selectedList})
            // console.log('Update Response:', JSON.stringify(response));
            if(response){
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record updated successfully',
                        variant: 'success'
                    })
                )
                this.hideModalBox();
            }
        } catch(error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: error.statusText,
                    message: error.body.message,
                    variant: 'error'
                })
            )
        } 
    }

}