import { LightningElement, wire } from 'lwc';
import getContentDocument from '@salesforce/apex/DocumentUploadController.getContentDocument';
import { subscribe, unsubscribe, onError} from 'lightning/empApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import DocumentModal from 'c/documentModal';

const QR_CODE_URL = 'https://api.qrserver.com/v1/create-qr-code';
// const read_QR_code_url = 'https://api.qrserver.com/v1/read-qr-code';

export default class GenerateQRCode extends LightningElement {
  url = 'https://empathetic-impala-7py9v6-dev-ed.trailblaze.my.site.com/upload/s/';
  imgSrc = '';
  uploaedImage = '';
  isDisable= true;

  file;
  fileName;
  result;
  contentDocumentId;

  channelName = '/data/ContentVersionChangeEvent';
  subscription = {};

  get acceptedFormats() {
    return ['.png'];
  }

  connectedCallback() {
    //this.registerErrorListener();
    this.handleSubscribe();
    this.handleGenerateQRCode();
  }

  handleSubscribe() {
    const messageCallback = (response) => {
        this.handleCaptureDataChange(response);
    };

    subscribe(this.channelName, -1, messageCallback).then((response) => {
        this.subscription = response;
    });
  }

  handleCaptureDataChange(response) {
    if(response.hasOwnProperty("data")){
        if(response.data.hasOwnProperty("payload")){
            const payload = response.data.payload;
            console.log(payload.FileType);
            //Refresh the data in own system and also in external system
            if(payload.FileType == 'PNG' || payload.FileType == 'JPG' || payload.FileType == 'JPEG'){
              if(payload.ChangeEventHeader.changeType == 'CREATE'){
                this.contentDocumentId = payload.ContentDocumentId;
                this.getDocumentFile(this.contentDocumentId);
                this.showToast("Success", "Image uploaded successfully", "success");
              }
            }
            else if(payload.FileType == 'PDF'){
              if(payload.ChangeEventHeader.changeType == 'CREATE'){
                this.contentDocumentId = payload.ContentDocumentId;
                this.getDocumentFile(this.contentDocumentId);
                this.showToast("Success", "PDF is uploaded successfully", "success");
              }
            }
            else {
              this.showToast("Error", "File type not supported", "error");
            }
            // console.log(`${response.data.payload.Name}, ${response.data.payload.First_Name__c}, ${response.data.payload.Last_Name__c}, ${response.data.payload.Tenure__c}`);
        }
    }
  }   

  async getDocumentFile(contentDocumentId) {
    const content = await getContentDocument({contentId: contentDocumentId})
    console.log(JSON.stringify(content));
    if(content) {
      if(content[0].FileType == 'PNG' || content[0].FileType == 'JPG' || content[0].FileType == 'JPEG'){
        this.uploaedImage = content[0].VersionDataUrl;
      } else {
        //this.oepnModal(content[0]);
      }
    } else {
      this.showToast('Error', 'No file found!', 'error');
    }
  }

  registerErrorListener() {
      onError((errors) => {
          console.log('Received error from server: ', JSON.stringify(errors));
          this.showToast("Error", errors.error, "error");
      });
  }

  handleUnsubscribe() {
    unsubscribe(this.subscription, (response) => {
        console.log('unsubscribe() response: ', JSON.stringify(response));
    });
  }

  // handleInputChange(event) {
  //   this.url = event.target.value;
  //   this.isDisable = false;
  // }

  handleGenerateQRCode() {
    const apiurl = `${QR_CODE_URL}?data=${encodeURIComponent(this.url)}&size=200x200`;
    // console.log('apiurl: ', apiurl);
    fetch(apiurl, {
        method: 'GET'
    })
    .then(res => {
        if(!res.ok) {
            console.log(res.statusText);
        }
        return res.blob();
    })
    .then(blob => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            }
            //reader.readAsArrayBuffer(blob);
            reader.readAsDataURL(blob);
        });
    })
    .then((imageData) => {
        this.imgSrc = imageData
        // console.log('imageData: ', imageData);
        this.isDisable = true;
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

//   onFileChange(event) {
//     this.file = event.target.files[0];
//     console.log('file: ', this.file);   
//     this.fileName = this.file.name;
//     console.log('fileName: ', this.fileName);
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       this.imgSrc = reader.result;
//     }
//     reader.readAsDataURL(this.file);
//   }

  handleUploadFinished(event) {
    // Get the list of uploaded files
    const uploadedFiles = event.detail.files;
    this.file = uploadedFiles[0];
    this.fileName = this.file.name;
  }

  


  


    // async readQRCode() {
  //   const formData = new FormData();
  //   formData.append('file', this.file);
  //   formData.append('outputformat', 'json');

  //   //use formdata to automatically set the content type to multipart/form-data
  //   const response = await fetch(read_QR_code_url, {
  //     method: 'POST',
  //     body: formData
  //   });

  //   if (!response.ok) {
  //     console.log(response.statusText);
  //   }

  //   const json = await response.json();
  //   this.result = JSON.stringify(json, null, 2);
  // }

  showToast(title, message, variant) {
      this.dispatchEvent(
          new ShowToastEvent({
              title: title,
              message: message,
              variant: variant
          })
      );
  }

  disconnectedCallback() {
    this.handleUnsubscribe();
  }
}