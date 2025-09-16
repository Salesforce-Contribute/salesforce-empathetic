import { LightningElement,api } from 'lwc';
import qrcode from './qrcode.js'; 
// import getDetails from '@salesforce/apex/qrCodeGeneratorController.getDetails';

export default class FeedQRcomponent extends LightningElement {


    @api recordId;    
    dataRetrived = false;    
    eventdata;
    strData = JSON.stringify('https://www.salesforce.com');

    // connectedCallback() {
    //     const qrCodeGenerated = new qrcode(0, 'H');                    
    //     qrCodeGenerated.addData(this.strData);                    
    //     qrCodeGenerated.make();                    
    //     let element = this.template.querySelector(".qrcode2");                    
    //     let svg = qrCodeGenerated.createSvgTag({});
    // }

    renderedCallback() {            
        const qrCodeGenerated = new qrcode(0, 'H');                    
        qrCodeGenerated.addData(this.strData);                    
        qrCodeGenerated.make();                    
        let element = this.template.querySelector(".qrcode2");                       
        element.innerHTML = qrCodeGenerated.createSvgTag({});
        
        // getDetails({recordId : this.recordId})
        // .then(result => {
        //     console.log(result);
        //     this.eventdata = result;  
        //     console.log('dr', this.eventdata); 
        //     this.dataRetrived = true;
        //     let strData = JSON.stringify('Name: ' + result.Full_Name__c + ', Email: ' + result.Preferred_Email__c);                    
        //     const qrCodeGenerated = new qrcode(0, 'H');                    
        //     qrCodeGenerated.addData(strData);                    
        //     qrCodeGenerated.make();                    
        //     let element = this.template.querySelector(".qrcode");                    
        //     element.innerHTML = qrCodeGenerated.createSvgTag({});
        // }) 
        // .catch(error => { 
        //      console.log(error); 
            
        // });    
    }
}