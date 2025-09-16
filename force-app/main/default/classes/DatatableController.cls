public without sharing class DatatableController {
    public DatatableController() {

    }

    @AuraEnabled(cacheable=true)
    public static list<Account> getAccounts(string searchKey) {
        try {
            String searchTerm = '%' + searchKey + '%';
            return [SELECT Id, Name, Type, Amount__c FROM Account WHERE Name LIKE :searchTerm LIMIT 10];
        } catch (Exception e) {
            throw new AuraHandledException('Account error: '+ e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        try{
            return [SELECT Id, LastName FROM Contact WHERE Account.Name != null WITH SECURITY_ENFORCED LIMIT 3];
        } catch (Exception e) {
            throw new AuraHandledException('Contact error: '+ e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsForFlow() {
        try{
            return [SELECT Id, LastName, Email FROM Contact WHERE Account.Name != null WITH SECURITY_ENFORCED LIMIT 3];
        } catch (Exception e) {
            throw new AuraHandledException('Contact error: '+ e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(String searchKey) {
        try{
            String key = '%' + searchKey + '%';
            return [SELECT AccountId, Account.Name, Id, FirstName, LastName, Title, Phone, Email, CreatedDate FROM Contact WHERE FirstName LIKE :key AND Account.Name != null];
        } catch (Exception e) {
            throw new AuraHandledException('Contact list error: '+ e.getMessage());
        }
    }

    

    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeads(){
        try {
            return [SELECT Id, Name, Rating, Status FROM Lead ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            throw new AuraHandledException('Lead error: '+ e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Lead> getSearchLead(String searchKey){
        try {
            String searchTerm = '%' + searchKey + '%';
            return [SELECT Id, Name, Rating, Status FROM Lead WHERE Name LIKE: searchTerm ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            throw new AuraHandledException('Lead search error: '+ e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOppportunities(){
        try {
            return [SELECT Id, Name, StageName, Amount FROM Opportunity ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            throw new AuraHandledException('Opportunity error: '+ e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeadsForWired(String leadId){
        try {
            return [SELECT Id, Name, Rating, Status FROM Lead WHERE Id=:leadId];
        } catch (Exception e) {
            throw new AuraHandledException('Lead error: '+ e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOppportunitiesForWired(String oppId){
        try {
            return [SELECT Id, Name, StageName, Amount FROM Opportunity WHERE Id=:oppId];
        } catch (Exception e) {
            throw new AuraHandledException('Opportunity error: '+ e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactListWired(String contId) {
        /*try{
            return [SELECT AccountId, Account.Name, Id, FirstName, LastName, Title, Phone, Email, CreatedDate FROM Contact WHERE Id =: contId];
        } catch (Exception e) {
            throw new AuraHandledException('Contact list error: '+ e.getMessage());
        }*/
        return new List<Contact>();
    }

    @AuraEnabled(cacheable=true)
    public static list<Account> getAccountsForPushTopic() {
        try {
            return [SELECT Id, Name, Rating FROM Account LIMIT 10];
        } catch (Exception e) {
            throw new AuraHandledException('Account error: '+ e.getMessage());
        }
    }

    @AuraEnabled
    public static void testApexError(){
        Integer d = 10 / 0;
        // try {
        //     return 'Successfully test error';
        // } catch (Exception e) {
        //     throw new AuraHandledException(e.getMessage());
        // }
    }

    @AuraEnabled(cacheable=true)
    public static List<Book__c> getBookList(){
        try {
            return [SELECT Id, Name, Price__c FROM Book__c ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}