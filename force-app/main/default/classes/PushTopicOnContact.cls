public with sharing class PushTopicOnContact {
    
    @AuraEnabled(cacheable=true)
    public static void refreshContact(String boatTypeId) {
        PushTopic pushTopic = new PushTopic();
        pushTopic.Name = 'ContactUpdates';
        pushTopic.Query = 'SELECT Name, Description__c, Geolocation__Latitude__s, Geolocation__Longitude__s, Picture__c, Contact__r.Name, BoatType__c, BoatType__r.Name, Length__c, Price__c FROM Boat__c';
        pushTopic.ApiVersion = 46.0;
        pushTopic.NotifyForOperationCreate = true;
        pushTopic.NotifyForOperationUpdate = true;
        pushTopic.NotifyForFields = 'Referenced';
        insert pushTopic;
    }
}