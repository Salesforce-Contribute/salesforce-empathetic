import { LightningElement } from 'lwc';
import { NavigationMixin } from "lightning/navigation";

export default class PostComponent extends NavigationMixin(LightningElement) {
    richtextvalue;
    shareDisable=true;
    formats = [
        'bold',
        'italic',
        'underline',
        'strike',
        'clean',
        'list',
        'image',
        'link',
        'mention',

    ];

    // Get value of rich text input field
    richTextOnChangehandler(event) {
        this.richtextvalue = event.target.value;
        this.richtextvalue.length > 0 ? this.shareDisable=false : this.shareDisable=true;
    }

    // Share post
    sharedhandler(event) {
        this.template.querySelector('c-shared-posted').sharedPost(this.richtextvalue)
        let richInput = this.template.querySelector('lightning-input-rich-text');
        richInput.value = '';
    }

}