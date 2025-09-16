import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import IMAGE_URL_FIELD from '@salesforce/schema/ContentDocument.LatestPublishedVersion.VersionDataUrl';

export default class EmailQuickAction extends NavigationMixin(LightningElement) {

    @api recordId;


    @api invoke(){
        console.log('IMAGE_URL_FIELD >>>>> '+JSON.stringify(IMAGE_URL_FIELD));
        var pageRef = {
            type:"standard__quickAction",
            attributes:{
                apiName:"Global.SendEmail"
            },
            state:{
                defaultFieldValues:encodeDefaultFieldValues({
                    //HtmlBody:"<html><body><img src=\'https://empathetic-impala-7py9v6-dev-ed.trailblaze.file.force.com/sfc/dist/version/renditionDownload?rendition=ORIGINAL_Png&versionId=0682w00000QIYZ9&operationContext=DELIVERY&contentId=05T2w00001gJm2Z&page=0&d=/a/2w000000QlNl/Iuvwr17fYLOhFQvXu8MatRao93hKrZCkOsAPsB.F_CI&oid=00D2w00000RplPe&dpt=null&viewId=\'></body></html>",
                    //HtmlBody:"<html><body><img src=\'/sfc/servlet.shepherd/document/download/0692w00000QBt9eAAD\'></body></html>",
                   // HtmlBody:"<html><body><a href=\'https://empathetic-impala-7py9v6-dev-ed.trailblaze.file.force.com/sfc/dist/version/renditionDownload?rendition=ORIGINAL_Png&versionId=0682w00000QIYZ9&operationContext=DELIVERY&contentId=05T2w00001gJm2Z&page=0&d=/a/2w000000QlNl/Iuvwr17fYLOhFQvXu8MatRao93hKrZCkOsAPsB.F_CI&oid=00D2w00000RplPe&dpt=null&viewId=\'>Open File To Download</a><img src=\'/sfc/servlet.shepherd/document/download/0692w00000QBt9eAAD\'></body></html>",
                   To:'force.it.solution@gmail.com',
                   Subject:"Hello from Salesforce Bolt",
                   contentDocumentIds:['0692w00000QBt9eAAD']
                }),
            }
        }
        this[NavigationMixin.Navigate] (pageRef);
    }
}