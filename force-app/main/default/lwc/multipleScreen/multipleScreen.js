import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';

export default class MultipleScreen extends LightningElement {
    @api recordId;
    @track currentScreen = 1;
    
    // Form data properties
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track phone = '';
    @track company = '';
    @track jobTitle = '';
    @track streetAddress = '';
    @track city = '';
    @track state = '';
    @track postalCode = '';
    @track preferredContact = '';
    @track priority = '';
    @track notes = '';
    
    get priorityOptions() {
        return [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' }
        ];
    }
    
    get contactOptions() {
        return [
            { label: 'Email', value: 'Email' },
            { label: 'Phone', value: 'Phone' },
            { label: 'SMS', value: 'SMS' }
        ];
    }
    
    // Screen visibility getters
    get isScreen1() {
        return this.currentScreen === 1;
    }
    
    get isScreen2() {
        return this.currentScreen === 2;
    }
    
    get isScreen3() {
        return this.currentScreen === 3;
    }
    
    get isScreen4() {
        return this.currentScreen === 4;
    }
    
    get isScreen5() {
        return this.currentScreen === 5;
    }
    
    get isLastScreen() {
        return this.currentScreen === 5;
    }
    
    get isPreviousDisabled() {
        return this.currentScreen === 1;
    }
    
    get isNextDisabled() {
        if (this.currentScreen === 1) {
            return !this.firstName || !this.lastName || !this.email;
        }
        if (this.currentScreen === 4) {
            return !this.priority;
        }
        return false;
    }
    
    get isSubmitDisabled() {
        return !this.firstName || !this.lastName || !this.email || !this.priority;
    }
    
    get progressBarStyle() {
        const percentage = (this.currentScreen / 5) * 100;
        return `width: ${percentage}%`;
    }
    
    // Navigation methods
    handlePrevious() {
        if (this.currentScreen > 1) {
            this.currentScreen--;
        }
    }
    
    handleNext() {
        if (this.currentScreen < 5) {
            this.currentScreen++;
        }
    }
    
    handleSubmit() {
        // Validate required fields
        if (!this.firstName || !this.lastName || !this.email || !this.priority) {
            this.showToast('Error', 'Please fill in all required fields', 'error');
            return;
        }
        
        // Here you would typically call an Apex method to save the data
        // For now, we'll just show a success message and close the panel
        this.showToast('Success', 'Record submitted successfully!', 'success');
        
        // Close the quick action panel
        this.dispatchEvent(new CloseActionScreenEvent());
    }
    
    // Form field change handlers
    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }
    
    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }
    
    handleEmailChange(event) {
        this.email = event.target.value;
    }
    
    handlePhoneChange(event) {
        this.phone = event.target.value;
    }
    
    handleCompanyChange(event) {
        this.company = event.target.value;
    }
    
    handleJobTitleChange(event) {
        this.jobTitle = event.target.value;
    }
    
    handleStreetAddressChange(event) {
        this.streetAddress = event.target.value;
    }
    
    handleCityChange(event) {
        this.city = event.target.value;
    }
    
    handleStateChange(event) {
        this.state = event.target.value;
    }
    
    handlePostalCodeChange(event) {
        this.postalCode = event.target.value;
    }
    
    handlePreferredContactChange(event) {
        this.preferredContact = event.target.value;
    }
    
    handlePriorityChange(event) {
        this.priority = event.target.value;
    }
    
    handleNotesChange(event) {
        this.notes = event.target.value;
    }
    
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
}