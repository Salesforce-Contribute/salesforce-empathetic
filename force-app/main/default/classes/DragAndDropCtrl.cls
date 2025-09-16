public with sharing class DragAndDropCtrl {
    public DragAndDropCtrl() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunity(){
        try {
            List<Opportunity> opplist = [SELECT Id, Name, AccountId, Account.Name, CloseDate, StageName, Amount FROM Opportunity];
            return opplist;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}