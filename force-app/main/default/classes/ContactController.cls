public with sharing class ContactController {
    public ContactController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [
            SELECT AccountId, Account.Name, Id, FirstName, LastName, Title, Phone, Email
            FROM Contact
            WITH SECURITY_ENFORCED
        ];
    }
}