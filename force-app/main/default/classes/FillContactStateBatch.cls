public class FillContactStateBatch implements Database.Batchable<sObject>, Schedulable {

    public List<Contact> start(Database.BatchableContext bc) {
        Config__c config = Config__c.getInstance();
        Integer batchSize = Integer.valueOf(config.Fill_State_Batch_Size__c);
        List<Contact> contactList = [SELECT Id, MailingPostalCode, MailingState FROM Contact WHERE
                                     RecordType.DeveloperName = 'Professional' AND
                                     MailingPostalCode != null AND
                                     MailingStateCode = null order BY createdDate DESC LIMIT :batchSize];
        return contactList;
    }
    
    public void execute(Database.BatchableContext bc, List<Contact> scope) {
        List<Contact> contactsToUpdate = new List<Contact>();
        Map<String, String> zipToStateMap = new Map<String, String>();
        Set<String> zipCodes = new Set<String>();
        
        // Retrieve Zip_Code__c records corresponding to the zip codes
        for (Contact contactObj : scope) {
            zipCodes.add(contactObj.MailingPostalCode);
        }
        
        for (Zip_Code__c zip : [SELECT Name, State__c FROM Zip_Code__c WHERE Name IN :zipCodes]) {
            zipToStateMap.put(zip.Name, zip.State__c);
        }
        
        for (Contact contactObj : scope) {
            if (contactObj.MailingPostalCode != null && contactObj.MailingState == null) {
                String state = zipToStateMap.get(contactObj.MailingPostalCode);
                if (state != null) {
                    contactObj.MailingState = state; // Populate the state field
                    contactsToUpdate.add(contactObj);
                }
            }
        }
        
        if(!contactsToUpdate.isEmpty()) {
            update contactsToUpdate;
        }
    }
    
    public void execute(SchedulableContext sc) {
        //Database.executebatch();
    }
    
    public void finish(Database.BatchableContext bc) {
    }
}
