import { LightningElement, api } from 'lwc';

export default class CreateNewTask extends LightningElement {
    @api openNewTask;
    @api taskListName;
    descriptionValue;
    titleValue;

    connectedCallback() {
        console.log('componet execute');
    }

    titleInputHandler(event) {
        this.titleValue = event.target.value;
    }

    taskInputHandler(event) {
        this.descriptionValue = event.target.value;
    }

    addTaskHandler() {
        const datetime = new Date();
        const saveEvent = new CustomEvent('save', {
            detail: {title:this.titleValue, description: this.descriptionValue, datetime:datetime, taskListName: this.taskListName}
        })
        this.dispatchEvent(saveEvent);
    }

    cancelTaskHandler() {
        this.openNewTask = false;
        const cancelEvent = new CustomEvent('cancel', {
            detail: {cancelTask: this.openNewTask}
        })
        this.dispatchEvent(cancelEvent);
        // this.todoList.slice(-1,1);
    }
}