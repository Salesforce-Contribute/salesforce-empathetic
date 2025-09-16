public without sharing class DocumentUploadController {
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

    @AuraEnabled
    public static List<ContentVersion> getContentDocument(String contentId){
        try {
            List<ContentVersion> content= [
                SELECT Id, ContentDocumentId, Title, ContentSize, FileType, FileExtension, ContentLocation, IsEncrypted, VersionDataUrl 
                FROM ContentVersion 
                WHERE ContentDocumentId =: contentId AND (FileExtension = 'pdf' OR FileExtension = 'png' OR FileExtension = 'jpg' OR FileExtension = 'jpeg')];
            return content;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}