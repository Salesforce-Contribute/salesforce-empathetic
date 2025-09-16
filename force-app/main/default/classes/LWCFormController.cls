public with sharing class LWCFormController {
    @AuraEnabled
    public static Account createRecord(Account accRec){
        try {            
            insert accRec;
            return accRec;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }       
    }
}