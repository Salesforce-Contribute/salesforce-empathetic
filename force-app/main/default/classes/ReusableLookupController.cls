public with sharing class ReusableLookupController {
    
    @AuraEnabled
    public static List<ResultWrapper> fetchRecords(SearchWrapper inputWrapper) {
        try {
            if(inputWrapper != null){
                String fieldsToQuery = 'SELECT Id, ';
                if(string.isNotBlank(inputWrapper.fieldApiName)){
                    fieldsToQuery = fieldsToQuery + inputWrapper.fieldApiName;
                }
                if(string.isNotBlank(inputWrapper.otherFieldApiName)){
                    fieldsToQuery = fieldsToQuery + ', ' + inputWrapper.otherFieldApiName;
                }
                String query = fieldsToQuery + ' FROM '+ inputWrapper.objectApiName;
                String filterCriteria = inputWrapper.fieldApiName + ' LIKE ' + '\'' + String.escapeSingleQuotes(inputWrapper.searchString.trim()) + '%\' LIMIT 10';
                if(String.isNotBlank(inputWrapper.selectedRecordId)) {
                    query += ' WHERE Id = \''+ inputWrapper.selectedRecordId + '\'';
                }else if(String.isNotBlank(inputWrapper.parentFieldApiName) && String.isNotBlank(inputWrapper.parentRecordId)){
                    query += ' WHERE '+ inputWrapper.parentFieldApiName+ ' = \''+ inputWrapper.parentRecordId + '\'';
                    query += ' AND ' + filterCriteria;
                } 
                else {
                    query += ' WHERE '+ filterCriteria;
                }
                List<ResultWrapper> returnWrapperList = new List<ResultWrapper>();
                for(SObject s : Database.query(query)) {
                    ResultWrapper wrap = new ResultWrapper();
                    wrap.mainField = (String)s.get(inputWrapper.fieldApiName);
                    wrap.subField = (String)s.get(inputWrapper.otherFieldApiName);
                    wrap.id = (String)s.get('id');
                    returnWrapperList.add(wrap);
                }
                return returnWrapperList;
            }
            return null;
        } catch (Exception err) {
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
        @AuraEnabled public String otherFieldApiName{get;set;}
        @AuraEnabled public String searchString{get;set;}
        @AuraEnabled public String selectedRecordId{get;set;}
        @AuraEnabled public String parentRecordId{get;set;}
        @AuraEnabled public String parentFieldApiName{get;set;}
    }

    @AuraEnabled
    public static void addAccountNameOnCantact(String value, String acctId, String contId) {
        System.debug('Value::'+ value);
        System.debug('AcctId::'+ acctId);
        System.debug('ContId::'+ contId);
        List<Contact> conList = [Select AccountId From Contact Where Id =: contId WITH SECURITY_ENFORCED];
        System.debug('Record:'+ conList);
        
        conList[0].AccountId = acctId;
        
        if(conList.size() > 0){
            try{
                update conList;              
            }catch(DmlException e){
                System.debug('Error::'+ e.getMessage());
                throw new AuraHandledException(e.getMessage());
            }
        }
    }

    // @AuraEnabled
    // public static List<Contact> addAccountNameOnCantact(String value, String acctId, String contId) {
    //     System.debug('Value::'+ value);
    //     System.debug('AcctId::'+ acctId);
    //     System.debug('ContId::'+ contId);
    //     List<Contact> conList = [Select AccountId From Contact Where Id =: contId WITH SECURITY_ENFORCED];
    //     System.debug('Record:'+ conList);
        
    //     conList[0].AccountId = acctId;
    //     return conList;
        
    // }

}