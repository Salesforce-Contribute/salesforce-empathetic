import {api} from 'lwc';
import LightningModal from 'lightning/modal';

export default class DocumentModal extends LightningModal {

    @api rowData;
    fileUrl;
    @api label;

    connectedCallback() {
        console.log('opened modal');
        console.log('rowData'+ JSON.stringify(this.rowData));
        
        console.log('call pdf');
        setTimeout(()=>{
            this.label = this.rowData.Title;
            var vfWindow = this.template.querySelector("iframe").contentWindow;
            console.log(vfWindow)
            vfWindow.postMessage({ detail: {base64String: this.rowData.base64String} }, this.vfIframeOrigin);

        }, 1000);
        this.fileUrl = this.rowData.VersionDataUrl;
    }

    closeModal() {
        this.close(null);
    }
}