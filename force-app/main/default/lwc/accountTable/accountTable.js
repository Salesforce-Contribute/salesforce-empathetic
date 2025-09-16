import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import deleteAccount from '@salesforce/apex/AccountController.deleteAccount';

export default class AccountTable extends LightningElement {

    accounts;
    error;
    wiredAccountResult;
    @wire(getAccounts)
    wiredAccounts( result ) {
        this. wiredAccountResult=result;
        if (result.data) {
            this.accounts = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.accounts = undefined;
            this.error = result.error;
        }
    }
    handleDelete(event) {
        const accountId= event.target.dataset.accountId;
        deleteAccount({ accountId })
            .then(() => {
                // Perform any success actions if needed
                refreshApex(this.wiredAccountResult);
            })
            .catch((error) => {
                // Handle the error if deletion fails
            });
    }
}