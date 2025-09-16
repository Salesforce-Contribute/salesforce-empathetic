public with sharing class FileUploadController {
    
    @AuraEnabled
    public static Id saveFile(String fileName, String base64Data, String contentType) {
        try {
            // Decode the base64 data
            String base64Blob = base64Data.substring(base64Data.indexOf(',') + 1);
            Blob fileBlob = EncodingUtil.base64Decode(base64Blob);
            
            // Create ContentVersion
            ContentVersion cv = new ContentVersion();
            cv.VersionData = fileBlob;
            cv.Title = fileName;
            cv.PathOnClient = fileName;
            cv.FirstPublishLocationId = UserInfo.getUserId(); // This will make the file private to the user
            
            insert cv;
            
            // Get the ContentDocumentId
            cv = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id];
            return cv.ContentDocumentId;
            
        } catch(Exception e) {
            throw new AuraHandledException('Error uploading file: ' + e.getMessage());
        }
    }
} 