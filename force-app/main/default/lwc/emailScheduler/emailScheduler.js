import { LightningElement } from 'lwc';
import startScheduleJob from '@salesforce/apex/EmailScheduleJobController.startScheduleJob';
import stopScheduleJob from '@salesforce/apex/EmailScheduleJobController.stopScheduleJob';
import resumeScheduleJob from '@salesforce/apex/EmailScheduleJobController.resumeScheduleJob';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class EmailScheduler extends LightningElement {
    selectedValue = '';

    scheduleOptions = [
        { label: '--None--', value: '' },
        { label: '5 min', value: '5' },
        { label: '15 min', value: '15' },
        { label: '1 hour', value: '60' },
    ];
    
    get isDisabled() {
        return !this.selectedValue || this.selectedValue === '';
    }
    
    handleScheduleChange(event) {
        this.selectedValue = event.detail.value;
    }
    
    handleStart() {
        if (!this.selectedValue || this.selectedValue === '') {
            this.showToast('Error', 'Please select a schedule duration', 'error');
            return;
        }
        const duration = Number(this.selectedValue);
        startScheduleJob({minutesInterval: duration})
        .then(result => {
            if(result) {
                this.showToast('Success', 'Job has been started successfully!', 'success');
            } else {
                this.showToast('Error', 'Failed to start email schedule', 'error');
            }
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
        });
    }

    handleStop() {
        stopScheduleJob()
        .then(result => {
            if(result) {
                this.showToast('Success', 'Job has been stopped successfully!', 'success');
            } else {
                this.showToast('Error', 'Failed to stop email schedule', 'error');
            }
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
        });
    }

    handleResume() {
        resumeScheduleJob()
        .then(result => {
            if(result) {
                this.showToast('Success', 'Job has been resumed successfully!', 'success');
            } else {
                this.showToast('Error', 'Failed to resume email schedule', 'error');
            }
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
        });
    }
    
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
}