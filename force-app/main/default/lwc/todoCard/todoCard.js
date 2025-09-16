import { LightningElement, api} from 'lwc';
import LightningConfirm from 'lightning/confirm';

export default class TodoCard extends LightningElement {
    @api item;
    isEdit=false;

    renderedCallback() {
        if(this.isEdit) {
            this.template.querySelector('c-bpm-manager-edit-item').displayValue(this.processTaskId);
        }
    }

    todoDisplayEditValues(event) {
        this.isEdit=true;
        this.processTaskId = event.target.dataset.updateId;
    }

    updateTodoItemHandler(event) {
        const processTaskId = event.detail.processTaskId;
        const status = event.detail.status;
        const description = event.detail.description;
        if(processTaskId) {
            const updateEvent = new CustomEvent('update', {
                detail: {processTaskId:processTaskId, status:status, description: description}
            })
            this.dispatchEvent(updateEvent);
        }
        this.cancelHanlder();
    }

    async todoDeleteHandler(event) {
        const processTaskId = event.target.dataset.deleteId;
        const processTaskName = event.target.dataset.name;
        const result = await LightningConfirm.open({
            label: 'Delete Confirmation',
            message: `Are you sure you want to delete ${processTaskName} task?`,
            variant: 'header',
            theme: 'error',
        });
        if(result) {
            if(processTaskId) {
                const updateEvent = new CustomEvent('delete', {
                    detail: {processTaskId:processTaskId}
                })
                this.dispatchEvent(updateEvent);
            }
        }
    }

    cancelHanlder() {
        this.isEdit=false;
    }
}