public with sharing class ChangeDataCaptureController {
    
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getEmployees(){
        try {
            return [SELECT Id, Name, First_Name__c, Last_Name__c, Tenure__c FROM Employee__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}