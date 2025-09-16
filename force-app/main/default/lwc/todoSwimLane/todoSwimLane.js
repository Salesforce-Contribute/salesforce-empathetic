import { LightningElement, api } from 'lwc';

export default class TodoSwimLane extends LightningElement {

    @api todoData;
    @api stage;
    @api size;
    isOpen=false;

    connectedCallback() {
        this.size = this.countRecordsByType(this.stage);
    }

    countRecordsByType(type) {
        const filteredItems = this.todoData.filter(item => item.StageName === type);
        return filteredItems.length;
    }

    handleItemDrag(evt){
        console.log('itemdrag ', evt.detail);
        const event = new CustomEvent('listitemdrag', {
            detail: evt.detail
        })
        this.dispatchEvent(event)
    }

    handleDragOver(evt){
        evt.preventDefault()
    }

    handleDrop(evt){
        console.log('handleDrop: '+ evt.detail);
        console.log('handleDrop', this.stage);
        const event = new CustomEvent('itemdrop', {
            detail: this.stage
        })
        this.dispatchEvent(event)
    }

    newTaskHandler(){
        console.log('open '+ this.stage);
        this.isOpen=true;
    }

    cancelHanlder() {
        this.isOpen=false;
    }
}