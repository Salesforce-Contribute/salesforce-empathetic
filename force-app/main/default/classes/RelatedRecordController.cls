public with sharing class RelatedRecordController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, OwnerId, Name FROM Account];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [SELECT AccountId, Account.Name, Id, FirstName, LastName, Title, Phone, Email, CreatedDate FROM Contact];
    }

    @AuraEnabled(cacheable=true)
    public static void fetchRelatedData(String accountId){
        try {
            System.debug('AccountId: '+ accountId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}