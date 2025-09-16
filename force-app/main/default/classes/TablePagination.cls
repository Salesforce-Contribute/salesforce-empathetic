public with sharing class TablePagination {
    public TablePagination() {
       
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Account> retrieveAccounts(){
        return [SELECT Id, Name, Type, Amount__c, BillingCountry, Email__c, Industry, Website, Phone, Active__c, AccountNumber, CreatedDate FROM Account WITH SECURITY_ENFORCED order by CreatedDate DESC];
    }


    @AuraEnabled
    public static void updateAmount(Object data) {
        System.Debug(' data ' + data);
        List<Account> accs = new List<Account>();
        List<WrapperRequest> actForUpdate = (List<WrapperRequest>) JSON.deserialize(JSON.serialize(data),List<WrapperRequest>.class);
        for(WrapperRequest wr : actForUpdate)
        {
            accs.add(new Account(Id = wr.Id, Amount__c = wr.amount));
        }
        System.Debug(' actForUpdate ' + actForUpdate);
        if(accs.size() == 0)
               throw new AuraHandledException('Please select the correct record to update');
        try {
            update accs;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactCase(){
        try {
            //List<Contact> contactCaseList = [SELECT Id, Name, Department, Title, Amount__c, (SELECT Id, CaseNumber, Priority, Subject FROM Cases) FROM Contact WHERE Id IN (SELECT ContactId FROM Case)];
          	List<Contact> contactCaseList = [SELECT Id, Name, Department, Title, Amount__c, (SELECT Id, CaseNumber, Priority, Subject FROM Cases) FROM Contact ORDER BY CreatedDate DESC];
            return contactCaseList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteContactOrCase(String recordId, String objectName){
        System.debug(recordId+' '+objectName);
        if(objectName=='Contact') {
         	List<Contact> con = [SELECT Id, Name FROM Contact WHERE Id =: recordId];
            try {
                System.debug('Contact => '+ con);
                delete con;
            } catch (DmlException e) {
               	throw new AuraHandledException(e.getMessage());
            }
        }
        else if(objectName=='Case') {
            List<Case> cas = [SELECT Id, Subject FROM Case WHERE Id =: recordId];
            try {
                System.debug('Case => '+ cas);
            	delete cas;
            } catch (DmlException e) {
                throw new AuraHandledException(e.getMessage());
            }
        } else {
            
        } 
        /*try {
            String query = 'SELECT Id FROM '+objectName+' WHERE Id = "'+recordId+'"';
            	delete query;
                Database.DeleteResult[] drList = new List<Database.DeleteResult>();
                drList = Database.delete(query,false); //Error - Illegal assignment from Database.DatabaseResult to List
                System.debug(drList);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }*/
    }

    public class WrapperRequest
    {
        Decimal amount;
        String id;
    }

	@AuraEnabled(cacheable=true)
    public static boolean recordUpdateNotify(Boolean isUpdate) {
        System.debug('isUpdate => '+ isUpdate);
        boolean flag = false;
        if(isUpdate == true) {
            flag = isUpdate;
        }
        else if(isUpdate == null) {
            flag = false;
        }
        return flag;
    }
    

}