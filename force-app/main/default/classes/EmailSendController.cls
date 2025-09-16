public with sharing class EmailSendController {
    
    public EmailSendController() {

    }
    
    /**
     * Send a simple email to a single recipient
     * @param toAddress - Email address of the recipient
     * @param subject - Subject of the email
     * @param body - Body content of the email
     * @return Boolean - True if email was sent successfully, false otherwise
     */
    public static Boolean sendEmail(String toAddress, String subject, String body) {
        try {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[]{toAddress});
            email.setSubject(subject);
            email.setPlainTextBody(body);
            
            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
            return true;
        } catch (Exception e) {
            System.debug('Error sending email: ' + e.getMessage());
            return false;
        }
    }
    
    /**
     * Send an email with HTML body
     * @param toAddress - Email address of the recipient
     * @param subject - Subject of the email
     * @param htmlBody - HTML body content of the email
     * @param plainTextBody - Plain text body content (fallback)
     * @return Boolean - True if email was sent successfully, false otherwise
     */
    @AuraEnabled
    public static Boolean sendHtmlEmail(String toAddress, String subject, String htmlBody, String plainTextBody) {
        System.debug('toAddress: ' + toAddress);
        System.debug('subject: ' + subject);
        System.debug('htmlBody: ' + htmlBody);
        System.debug('plainTextBody: ' + plainTextBody);
        try {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[]{toAddress});
            email.setReplyTo('salesforce.contribute@gmail.com');
            email.setSubject(subject);
            email.setHtmlBody(htmlBody);
            
            Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
            if (results[0].success) {
                Account acc = new Account();
                acc.Name = 'Test Account';
                acc.Email__c = toAddress;
                insert acc;
                return true;
            } else {
                System.debug('The email failed to send: '+ results[0].errors[0].message);
            }
            return true;
        } catch (Exception e) {
            System.debug('Error sending HTML email: ' + e.getMessage());
            return false;
        }
    }
    
    /**
     * Send email to multiple recipients
     * @param toAddresses - List of email addresses
     * @param ccAddresses - List of CC email addresses (optional)
     * @param bccAddresses - List of BCC email addresses (optional)
     * @param subject - Subject of the email
     * @param body - Body content of the email
     * @return Boolean - True if email was sent successfully, false otherwise
     */
    public static Boolean sendBulkEmail(List<String> toAddresses, List<String> ccAddresses, 
                                      List<String> bccAddresses, String subject, String body) {
        try {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(toAddresses);
            
            if (ccAddresses != null && !ccAddresses.isEmpty()) {
                email.setCcAddresses(ccAddresses);
            }
            
            if (bccAddresses != null && !bccAddresses.isEmpty()) {
                email.setBccAddresses(bccAddresses);
            }
            
            email.setSubject(subject);
            email.setPlainTextBody(body);
            
            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
            return true;
        } catch (Exception e) {
            System.debug('Error sending bulk email: ' + e.getMessage());
            return false;
        }
    }
    
    /**
     * Send email with file attachment
     * @param toAddress - Email address of the recipient
     * @param subject - Subject of the email
     * @param body - Body content of the email
     * @param attachmentName - Name of the attachment file
     * @param attachmentBody - Content of the attachment
     * @param contentType - MIME type of the attachment
     * @return Boolean - True if email was sent successfully, false otherwise
     */
    public static Boolean sendEmailWithAttachment(String toAddress, String subject, String body,
                                                String attachmentName, Blob attachmentBody, String contentType) {
        try {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[]{toAddress});
            email.setSubject(subject);
            email.setPlainTextBody(body);
            
            // Create attachment
            Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
            attachment.setFileName(attachmentName);
            attachment.setBody(attachmentBody);
            attachment.setContentType(contentType);
            
            email.setFileAttachments(new Messaging.EmailFileAttachment[]{attachment});
            
            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
            return true;
        } catch (Exception e) {
            System.debug('Error sending email with attachment: ' + e.getMessage());
            return false;
        }
    }
    
    /**
     * Send email using org-wide email address
     * @param toAddress - Email address of the recipient
     * @param subject - Subject of the email
     * @param body - Body content of the email
     * @param orgWideEmailAddressId - ID of the org-wide email address
     * @return Boolean - True if email was sent successfully, false otherwise
     */
    public static Boolean sendEmailFromOrgWideAddress(String toAddress, String subject, String body, 
                                                    Id orgWideEmailAddressId) {
        try {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[]{toAddress});
            email.setSubject(subject);
            email.setPlainTextBody(body);
            email.setOrgWideEmailAddressId(orgWideEmailAddressId);
            
            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
            return true;
        } catch (Exception e) {
            System.debug('Error sending email from org-wide address: ' + e.getMessage());
            return false;
        }
    }
    
    /**
     * Send email with template
     * @param toAddress - Email address of the recipient
     * @param templateId - ID of the email template
     * @param targetObjectId - ID of the record to merge with template
     * @return Boolean - True if email was sent successfully, false otherwise
     */
    public static Boolean sendEmailWithTemplate(String toAddress, Id templateId, Id targetObjectId) {
        try {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[]{toAddress});
            email.setTemplateId(templateId);
            email.setTargetObjectId(targetObjectId);
            
            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
            return true;
        } catch (Exception e) {
            System.debug('Error sending email with template: ' + e.getMessage());
            return false;
        }
    }
    
    /**
     * Send email with custom sender display name
     * @param toAddress - Email address of the recipient
     * @param subject - Subject of the email
     * @param body - Body content of the email
     * @param senderDisplayName - Display name for the sender
     * @return Boolean - True if email was sent successfully, false otherwise
     */
    public static Boolean sendEmailWithSenderName(String toAddress, String subject, String body, 
                                                String senderDisplayName) {
        try {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[]{toAddress});
            email.setSubject(subject);
            email.setPlainTextBody(body);
            email.setSenderDisplayName(senderDisplayName);
            
            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
            return true;
        } catch (Exception e) {
            System.debug('Error sending email with sender name: ' + e.getMessage());
            return false;
        }
    }
}