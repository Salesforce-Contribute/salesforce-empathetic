import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import jobScheduler from '@salesforce/apex/PicklistInput.jobScheduler'

export default class PicklistInput extends LightningElement {
    
    @track options = [
        {label:'---None---'},
        {label:'5 min', value:5},
        {label:'10 min', value:10},
        {label:'15 min', value:15},
        {label:'20 min', value:20},
    ];
    
    selectedValue;
    noSelectedMsg = 'No Jobs Scheduled'

    handleOnChange(e){
        console.log(e)
        this.selectedValue = e.detail.value;
    }

    async handleStartScheduler(){
        if(this.selectedValue!==undefined){

            try{
                const result = await jobScheduler({data:this.selectedValue})
                console.log(JSON.stringify('Apex result:', result))
                const msg = JSON.stringify(result)
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: msg,
                        variant: 'success'
                    })
                )
            }catch(error){
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error ',
                        message: error.body.message,
                        variant: 'error'
                    })
                )
            }
        }else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select job scheduler !',
                    variant: 'error'
                })
            )
        }
    }

    handleStopScheduler(){
        alert('Hi, StopScheduler')
    }
}