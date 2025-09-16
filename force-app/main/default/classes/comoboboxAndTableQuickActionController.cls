public with sharing class comoboboxAndTableQuickActionController {
    @AuraEnabled
    public static List<ResultWrapper> fetchRecords(SearchWrapper inputWrapper) {
        try {
            if(inputWrapper != null)
            {
                String fieldsToQuery = 'SELECT Id, ';
                if(string.isNotBlank(inputWrapper.fieldApiName)){
                    fieldsToQuery = fieldsToQuery + inputWrapper.fieldApiName;
                }
                String query = fieldsToQuery + ' FROM '+ inputWrapper.objectApiName;
                String filterCriteria = inputWrapper.fieldApiName + ' LIKE ' + '\'' + String.escapeSingleQuotes(inputWrapper.searchString.trim()) + '%\' LIMIT 10';
                if(String.isNotBlank(inputWrapper.selectedRecordId)) {
                    query += ' WHERE Id = \''+ inputWrapper.selectedRecordId + '\'';
                }
                else {
                    query += ' WHERE '+ filterCriteria;
                }
                List<ResultWrapper> returnWrapperList = new List<ResultWrapper>();
                for(SObject s : Database.query(query))
                {
                    ResultWrapper wrap = new ResultWrapper();
                    wrap.mainField = (String)s.get(inputWrapper.fieldApiName);
                    wrap.id = (String)s.get('id');
                    returnWrapperList.add(wrap);
                }
                return returnWrapperList;
            }
            return null;
        }
        catch (Exception err)
        {
            throw new AuraHandledException(err.getMessage());
        }
    }

    public class ResultWrapper{
        @AuraEnabled public String mainField{get;set;}
        @AuraEnabled public String subField{get;set;}
        @AuraEnabled public String id{get;set;}
    }

    public class SearchWrapper {
        @AuraEnabled public String objectApiName{get;set;}
        @AuraEnabled public String fieldApiName{get;set;}
        @AuraEnabled public String searchString{get;set;}
        @AuraEnabled public String selectedRecordId{get;set;}
    }

    @AuraEnabled
    public static void receiveOppId(String oppId)
    {
        System.debug('oppId::'+ oppId);
    }

    @AuraEnabled
    public static List<Contact> getTransRecords(String oppId)
    {
        List<Opportunity> opps = [Select Id, InvoiceNumber__c from Opportunity where Id = :oppId];
        String batchNumber = null;
        System.debug('opps:'+ opps);
        if(opps.isEmpty())
            return null;
        batchNumber = opps[0].InvoiceNumber__c;
        System.debug('BatchNo:'+ batchNumber);
        //List<Trans__c> lstTrans = [Select Name, Batch__c, Agency__r.Name, Individual__r.Name,State__r.Name from Trans__c Where Batch__c =: batchNumber];
        //System.Debug(' List: ' + lstTrans);
        //return lstTrans;
        List<Contact> lstContact = [Select Name, Email FROM Contact Where InvoiceNumber__c  = :batchNumber];
        System.debug('ContactList'+ lstContact);
        return lstContact;
    }
}