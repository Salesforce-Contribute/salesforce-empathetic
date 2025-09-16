import { LightningElement, track, wire } from 'lwc';
import saveFile from '@salesforce/apex/DocumentUploadController.saveFile';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DocumentUpload extends LightningElement {
    @track showCamera = false;
    @track imgSrc;
    file;
    fileName;
    stream;

    get acceptedFormats() {
        return ['.pdf', '.png', '.jpg', '.jpeg'];
    }

    // handleFileChange(event) {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
            
    //         reader.onload = (e) => {
    //             const fileData = e.target.result;
    //             this.imgSrc = fileData;
    //             this.file = file;
    //             console.log('file: ', this.file);
    //             console.log('file size: ', this.file.size, 'In KB' + this.file.size / 1024 +' KB');
    //             this.fileName = file.name;
    //             console.log('fileName: ', this.fileName);
                
    //             // Check file size before saving
    //             if (this.isValidFileSize(file)) {
    //                 this.saveFileToSalesforce(fileData, this.fileName, 'image/png');
    //             } else {
    //                 this.showToast('Error', 'File size must be between 20KB and 50KB', 'error');
    //             }
    //         };
            
    //         reader.readAsDataURL(file);
    //     }
    // }

    // isValidFileSize(file) {
    //     const fileSizeInKB = file.size / 1024; // Convert bytes to KB
    //     return fileSizeInKB >= 20 && fileSizeInKB <= 100;
    // }

    async saveFileToSalesforce(base64Data, fileName, contentType) {
        //Please controle the image size before uploading..
        
        // Calculate base64 size
        const base64SizeInKB = (base64Data.length * 0.75) / 1024; // Approximate size in KB
        if (base64SizeInKB < 20 || base64SizeInKB > 100) {
            this.showToast('Information', 'Image size must be between 20KB and 100KB', 'info');
            return;
        }
        
        const contentId = await saveFile({fileName: fileName, base64Data: base64Data, contentType: contentType})
        if(contentId) {
            this.showToast('Success', 'File uploaded successfully', 'success');
        } else {
            this.showToast('Error', 'Error uploading file', 'error');
        }
    }


    //When click on capture photo button
    async handleCapturePhoto() {
        try {
            if(this.imgSrc) this.imgSrc = null;
            // Request camera access
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment', // Use back camera on mobile devices
                    width: 400, 
                    height: 400
                } 
            });

            // Show camera view
            this.showCamera = true;
            
            // Wait for the DOM to update and video element to be available
            setTimeout(() => {
                // Get video element and set stream
                const video = this.template.querySelector('video');
                if (video) {
                    video.srcObject = this.stream;
                } else {
                    this.showToast('Error', 'Could not access video element', 'error');
                }
            }, 0);
            
        } catch (error) {
            this.showToast('Camera', 'Please enable camera permissions in your device settings', 'info');
            console.error('Error accessing camera:', error);
        }
    }

    takePhoto() {
        const video = this.template.querySelector('video');
        const canvas = this.template.querySelector('canvas');
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Draw current video frame to canvas
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Convert canvas to base64 image
        const imageData = canvas.toDataURL('image/jpeg');
        this.imgSrc = imageData;
        this.saveFileToSalesforce(imageData, 'camera-photo.jpg', 'image/jpeg');
        // Close camera
        this.closeCamera();
    }

    closeCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        this.showCamera = false;
    }
    

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }

    // Clean up camera when component is destroyed
    disconnectedCallback() {
        this.closeCamera();
    }
}