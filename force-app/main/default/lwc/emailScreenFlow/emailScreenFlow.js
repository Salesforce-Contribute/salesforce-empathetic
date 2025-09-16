import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendHtmlEmail from '@salesforce/apex/EmailSendController.sendHtmlEmail';

export default class EmailScreenFlow extends LightningElement {
    @api useremail;
    @api subject;
    @api username;
    @api emailBody;
    @api isEditMode = false;
    // @api disabledCategories = ['INSERT_CONTENT', 'REMOVE_FORMATTING'];
    allowedFormats = [
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'list',
        'indent',
        'align',
        'link',
        'header',
    ];
    
    // Internal state
    _body = '';
    _isEditing = false;
    _originalBody = '';

    // Getter for the body content
    get body() {
        return this._body || this.emailBody || this.getDefaultEmailBody();
    }

    // Getter for edit mode
    get isEditing() {
        return this._isEditing || this.isEditMode;
    }

    // Getter for button text
    get editButtonText() {
        return this.isEditing ? 'Cancel' : 'Edit';
    }

    // Getter for save button visibility
    get showSaveButton() {
        return this.isEditing;
    }

    // Getter for rich text editor visibility
    get showRichTextEditor() {
        return this.isEditing;
    }

    // Getter for display mode visibility
    get showDisplayMode() {
        return !this.isEditing;
    }

    // Default email body template
    getDefaultEmailBody() {
        return `
            <html>
            <body style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.6;">
                <p>${this.useremail}</p>
                <p>Dear colleagues,</p>
                <p></br></p>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                <p></br></p>
                <p>Sincerely,</p>
                <p><strong>${this.username}</strong></p>
            </body>
            </html>
        `;
    }

    // Handle edit button click
    handleEditClick() {
        if (this.isEditing) {
            // Cancel editing - restore original content
            this._body = this._originalBody;
            this._isEditing = false;
        } else {
            // Start editing - save current content as original
            this._originalBody = this._body;
            this._isEditing = true;
        }
    }

    // Handle save button click
    handleSaveClick() {
        // Save the current content
        this._originalBody = this._body;
        this._isEditing = false;
        console.log(this._body);
        // Dispatch custom event to notify flow of the saved content
        this.dispatchEvent(new CustomEvent('emailsaved', {
            detail: {
                emailBody: this._body
            }
        }));
    }

    // Handle body change in rich text editor
    handleBodyChange(event) {
        this._body = event.target.value;
    }

    async handleSendEmail() {
        
        const response = await sendHtmlEmail({toAddress:toAddress, subject:this.subject, htmlBody:htmlBody, plainTextBody:plainTextBody});
        if(response){
        this.dispatchEvent(new ShowToastEvent({
            title: 'Email Sent',
                message: 'Email sent successfully',
                variant: 'success'
            }));
        }else{
            this.dispatchEvent(new ShowToastEvent({
                title: 'Email Failed',
                message: 'Email failed to send',
                variant: 'error'
            }));
        }
    }
}