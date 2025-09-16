// import { LightningElement } from 'lwc';
// import getPdfList from '@salesforce/apex/pdfViewerController.getPdfList';
// import getDoc from '@salesforce/apex/pdfViewerController.getDoc';

// export default class PdfViewer extends LightningElement {

//     columns = [
//         {label: 'PDF Name', fieldName: 'fileName', type: 'text'}
//     ]
//     pdfList = [];

//     connectedCallback() {
//         getPdfList()
//         .then((response) => {
//             console.log(response);
//             this.pdfList = response;
//         })
//         .catch((error) => {
//             console.log('Error: '+ error.body.message);
//         })
//     }
// }

import { LightningElement, track } from 'lwc';
import getPdfList from '@salesforce/apex/pdfViewerController.getPdfList';
import getDoc from '@salesforce/apex/pdfViewerController.getDoc';
import showPdfFiles from '@salesforce/apex/pdfViewerController.showPdfFiles';
import DocumentModal from 'c/documentModal';
import { subscribe, unsubscribe, onError} from 'lightning/empApi';

import { loadScript } from 'lightning/platformResourceLoader';
import JS_PDF from '@salesforce/resourceUrl/jspdf';
import HTML_TO_PDF from '@salesforce/resourceUrl/htmlpdf';
import dompurify from '@salesforce/resourceUrl/dompurify'

const actions = [
    { label: 'View PDF', name: 'viewpdf' },
];
const columns = [
    {label: 'PDF Name', fieldName: 'docName', type: 'text'},
    {label: 'Doc Type', fieldName: 'docType', type: 'text'},
    {label: 'Import date', fieldName: 'importdate', type: 'date'},
    {label: 'View PDF', type: 'button', typeAttributes: { name: 'viewpdf', title: 'Open PDF', disabled: false, iconPosition: 'left', iconName:'doctype:pdf', variant:'base'}},
    // {label: 'PDF Name', fieldName: 'fileName', type: 'url', typeAttributes: {label: {fieldName: 'docName'}, target: '_blank'}},
    // {type: 'button-icon', typeAttributes: {name:'viewpdf', title:'ViewPDF', alternativeText:'pdf', class:'', disabled:'', iconClass:'', size:'large', iconName:'doctype:pdf', variant:'bare'}}

    // {type: 'action', typeAttributes: { rowActions: actions }}
]

const fileColumns = [
    {label: 'PDF Name', fieldName: 'Title', type: 'text'},
    {label: 'View PDF', type: 'button', typeAttributes: { name: 'filePdf', title: 'File PDF', disabled: false, iconPosition: 'left', iconName:'doctype:pdf', variant:'base'}},
]

export default class PdfViewer extends LightningElement {

    

    columns = columns; 
    fileColumns =fileColumns;   
    pdfDoc={};
    data = [{"id":1,"name":"John Doe", "dateofbirth":"20-09-2020", "totalitem":2,"itempercost":"20.15", "bill":"$40.30"}]
    pdfDocList;

    @track pdfFileList = [];

    subscription = {};
    channelName = '/data/ContentVersionChangeEvent';
    contentDocumentId;


    connectedCallback() {
        this.handleSubscribe();
        this.loadStaticResource();
        
        getPdfList()
        .then((response) => {
            this.pdfDocList = [{"fileName":"003r000000aZZ0PAAW-20240227T171514-Test 1-V3.pdf","importdate":"2024-02-27T17:15:14.000Z","docName":"IMGDEV301055","base64String":null,"description":"Inbound Document","docType":"Test 1","dID":286099},{"fileName":"003r000000aZZ0PAAW-20231023T195653-Test 2-image-20230221-154755.pdf","importdate":"2023-10-23T14:56:54.000Z","docName":"IMGDEV238951","base64String":null,"description":"Inbound Document","docType":"Test 2","dID":223998}];
        })
        .catch((error) => {
            console.error('error==> '+ error);
        })
        this.getPdfFiles();
    }

    getPdfFiles() {
        showPdfFiles()
        .then((response) => {
            this.pdfFileList = response;
        })
        .catch((error) => {
            console.log('FilestLIst: '+ error.body.message);
        })
    }

    jsPDFInitialized = false;

	loadStaticResource() {
		if (!this.jsPDFInitialized) {
			this.jsPDFInitialized = true;
			loadScript(this, JS_PDF)
            .then(() => {
                console.log('jsPDF library loaded successfully');
            })
            .catch((error) => {
                console.error('Error loading jsPDF library', error);
            });

            loadScript(this, HTML_TO_PDF)
            .then(() => {
                console.log('htmlPDF library loaded successfully');
            })
            .catch((error) => {
                console.error('Error loading htmlPDF library', error);
            });

            loadScript(this, dompurify)
            .then(() => {
                console.log('dompurify library loaded successfully');
            })
            .catch((error) => {
                console.error('Error loading dompurify library', error);
            });
		}
	}

    handleGeneratePDF() {
		if (this.jsPDFInitialized) {
            // Make sure to correctly reference the loaded jsPDF library.
            const doc = new window.jspdf.jsPDF();  

			// Add content to the PDF.
            
			doc.text('hello', 10, 10);

			// Save the PDF.
			//doc.save('generated_pdf.pdf');
            window.open(doc.output('bloburl')); 
            //----------------------------------------------------------
            /*const data = {"name":"John Doe", "dateofbirth":"20-09-2020", "totalitem":2,"itempercost":"20.15", "bill":"$40.30"}
            let text = "<div><table>"
                for (let x in data) {
					if(x == "signature") {
						text += "<tr><td style='font-weight:700;'>" + x + "</td><td><img src="+ data[x]+" alt='signature not here' width='50' height='50'/></td></tr>";
					} else {
						text += "<tr><td style='font-weight:700;'>" + x + "</td><td>" + data[x] + "</td></tr>";
					}
                  
                }
            text += "</table><div>"
            console.log(text);
        
            const doc = new window.jspdf.jsPDF('p', 'pt', 'a4'); 

            let pdfjs = text;

            
            doc.html(pdfjs, {
                callback: function(doc) {
                    window.open(doc.output('bloburl')); 
                    //doc.save("newpdf.pdf");
                },
                x: 20,
                y: 20
            }).then((res) => {
                console.log('resovle'+ res);
            }).catch((error) => {
                console.log('Excetion: '+ error);
            });*/

		} else {
			console.error('jsPDF library not initialized');
		}
	}

    handleRowActionForFile(event) {
        const actionName = event.detail.action.name;
        console.log(actionName);
        const row = event.detail.row; 
        switch (actionName) {
            case 'filePdf':
                console.log('-call modal');
                this.oepnModal(row);
                break;
            default:
        } 
    }

    oepnModal(row) {
        DocumentModal.open({
            label: 'View PDF',
            size: 'large',
            description: 'Read the document',
            rowData: row,
        })
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        console.log(JSON.stringify(row)+'=> '+JSON.stringify(actionName));  

        switch (actionName) {
            case 'viewpdf':
                this.viewPDF(row);
                break;
            default:
        }


    }

    viewPDF(row) {
        const docId = row.dID;
        getDoc({docId: docId})
        .then((response)=>{
            let parseData = JSON.parse(response)
            let base64Data = parseData.results[0].base64String;
            let docId = parseData.results[0].docId;
            const row = {base64Data:base64Data, docId:docId};
            this.oepnModal(row);

            // var blob = this.base64ToBlob(base64Data, 'application/pdf');
            // let pdfUrl = URL.createObjectURL(blob)
            // console.log('url: '+ pdfUrl);
            // window.open(pdfUrl, "_blank");
            //blob:https://empathetic-impala-7py9v6-dev-ed.trailblaze.lightning.force.com/4da5e4d3-347f-45fb-b969-b2e0ff14901a
        })
        .catch((error)=>{
            console.error('getDoc error==> '+ error);
        })
    }

    /*viewPDF(row) {
        const docId = row.dID;
        console.log('docId: '+ docId);
        var arr = 'Hello javascript world !';
        var bto = btoa(arr);
        console.log(bto);
        var blob = this.base64ToBlob(bto, 'application/pdf');
        let pdfUrl = URL.createObjectURL(blob)
        console.log('url: '+ pdfUrl);
        window.open(pdfUrl, "_blank");
    } */

    base64ToBlob(base64, contentType) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    }

    handleCaptureDataChange(response) {
        if(response.hasOwnProperty("data")){
            if(response.data.hasOwnProperty("payload")){
                const payload = response.data.payload;
                console.log(payload.FileType);
                //Refresh the data in own system and also in external system
                if(payload.FileType == 'PNG' || payload.FileType == 'JPG' || payload.FileType == 'JPEG'){
                
                }
                else if(payload.FileType == 'PDF'){
                    if(payload.ChangeEventHeader.changeType == 'CREATE'){
                        this.contentDocumentId = payload.ContentDocumentId;
                        this.getPdfFiles();
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

    handleSubscribe() {
        const messageCallback = (response) => {
            this.handleCaptureDataChange(response);
        };

        subscribe(this.channelName, -1, messageCallback).then((response) => {
            this.subscription = response;
        });
    }

    registerErrorListener() {
        onError((errors) => {
            console.log('Received error from server pdfViewer: ', JSON.stringify(errors));
        });
    }

    handleUnsubscribe() {
        unsubscribe(this.subscription, (response) => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
        });
    }
    disconnectedCallback() {
        this.handleUnsubscribe();
    }
}