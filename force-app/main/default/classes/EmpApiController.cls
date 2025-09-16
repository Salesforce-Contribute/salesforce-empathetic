public with sharing class EmpApiController {
    public EmpApiController() {

    }

    @AuraEnabled
    public static void empapi(String msg) {
        System.debug('Contact event...');
        Contact__e evnt = new Contact__e();
        evnt.message__c = msg;
        EventBus.publish(evnt);
    }

    /*@AuraEnabled
    public static void AccountUpdatedEvent() {
        System.debug('AccountUpdatedEvent()...');
        Account_Updated__e evnt = new Account_Updated__e();
        System.debug('event: '+ evnt);
    }*/
}