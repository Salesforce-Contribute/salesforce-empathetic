import { LightningElement, api} from 'lwc';

export default class TodoList extends LightningElement {

    @api item;
    @api stage;
    isEdit=false;

    get isSameStage() {
        return this.item.StageName == this.stage;
    }

    connectedCallback() {
        
    }

    updateHandler() {
        this.isEdit=true;
        console.log(JSON.stringify(this.item));
    }

    deleteHandler(event) {
        let variable1 = JSON.stringify(this.item);
        console.log('This.item = ', variable1);
        //console.log('Test State = ', variable1.get('state'));
        console.log('Test Status = ', variable1.status);
    }

    cancelHanlder() {
        this.isEdit=false;
    }

    itemDragStart(){
        console.log('itemDragStart');
        const event = new CustomEvent('itemdrag', {
            detail: this.item.Id
        })
        this.dispatchEvent(event)
    }
}