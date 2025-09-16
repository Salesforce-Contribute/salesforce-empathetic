public class EmailSchedulerJob implements Schedulable {
    private String emailAddress;
    private Integer durationMinutes;
    
    public EmailSchedulerJob(String emailAddress, Integer durationMinutes) {
        this.emailAddress = emailAddress;
        this.durationMinutes = durationMinutes;
    }
    
    public void execute(SchedulableContext ctx) {
        try {
            // Send email based on the scheduled duration
            sendScheduledEmail();
        } catch (Exception e) {
            System.debug('Error in EmailSchedulerJob: ' + e.getMessage());
        }
    }
    
    private void sendScheduledEmail() {
        try {
            // Create email content
            String subject = 'Scheduled Email - ' + durationMinutes + ' minutes interval';
            String body = 'This is a scheduled email sent every ' + durationMinutes + ' minutes.\n\n';
            body += 'Scheduled at: ' + System.now() + '\n';
            body += 'Duration: ' + durationMinutes + ' minutes\n\n';
            body += 'This email was sent automatically by the Email Scheduler system.';
            
            // Use the EmailSchedulerController method for consistency
            String result = EmailSchedulerController.sendEmail(emailAddress, subject, body);
            System.debug('Scheduled email result: ' + result);
            
        } catch (Exception e) {
            System.debug('Error sending scheduled email: ' + e.getMessage());
            
            // Fallback: Send email directly if the controller method fails
            try {
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                email.setToAddresses(new String[]{emailAddress});
                email.setSubject('Scheduled Email - ' + durationMinutes + ' minutes interval');
                
                String emailBody = 'This is a scheduled email sent every ' + durationMinutes + ' minutes.\n\n';
                emailBody += 'Scheduled at: ' + System.now() + '\n';
                emailBody += 'Duration: ' + durationMinutes + ' minutes\n\n';
                emailBody += 'This email was sent automatically by the Email Scheduler system.';
                
                email.setPlainTextBody(emailBody);
                email.setSenderDisplayName('Email Scheduler System');
                
                Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
                System.debug('Fallback email sent successfully to: ' + emailAddress);
                
            } catch (Exception fallbackException) {
                System.debug('Fallback email also failed: ' + fallbackException.getMessage());
            }
        }
    }
}
