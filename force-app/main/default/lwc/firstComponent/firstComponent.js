import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class FirstComponent extends LightningElement {
   
   // Only use direct DOM manipulation if it can’t be expressed via the template
   bgColor;
   digits;
   badNumericInput;

   handleInputChange(evt) {
      this.bgColor = evt.target.value;
   }

   get divStyle() {
      return  `width: 100px; height: 100px; background-color: #${this.bgColor};`
   }

   @wire(getRecord, { recordId: '0032w000012kjmJAAQ',  fields: ['Contact.Name', 'Contact.Title'] }) 
   handleRecord({ err, data }) {
      if (data) {
         // 🚫 Error: Invalid mutation!
         /*data.fields.Summary = {
            value: `${data.fields.Name.value} (${data.fields.Title.value})` 
         };
         this.contact = data;
         console.log('Contact data: '+ this.contact);*/
         
         // 👍: Only copy what is needed.
         const {fields} = data;

         this.contact = {fields:{...fields, Summary: {
            value: `${fields.Name.value} (${fields.Title.value})` 
         }}}

         // console.log('Only needed: '+ JSON.stringify(this.contact));


      }
   }

   blurNumberHandler() {
      if(isNaN(this.digits)) {
         this.badNumericInput = 'You typed invalid value.' 
      }
      if(this.digits) {
         this.badNumericInput = 'Please enter numeric value.'  
      }
   }

   submitHandler() {
      if(isNaN(this.digits) && this.digits == undefined) {
         this.badNumericInput = 'You typed invalid value.' 
         console.error(this.badNumericInput);
      
      }
   }
}