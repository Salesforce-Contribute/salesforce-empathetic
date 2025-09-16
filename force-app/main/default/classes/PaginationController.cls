public with sharing class PaginationController {
    public PaginationController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccount(Integer limitValue, Integer offsetValue){
        try{          
            System.debug('LIMIT: '+ limitValue +', OFFSET: '+offsetValue);
            List<Account> acc = [SELECT Id, Name, Type, Amount__c, BillingCountry FROM Account ORDER BY Name LIMIT :limitValue OFFSET :offsetValue];
            return acc;
            // String query = 'SELECT Id, Name, Type, Amount__c, BillingCountry FROM Account ORDER BY Name LIMIT '+limitValue+' OFFSET '+offsetValue;
            // return Database.query(query);
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    //This method is used in lightning logger exampleComponent
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountForLogger(){
        try{          
            List<Account> acc = [SELECT Id, Name, Type, Amount__c, BillingCountry FROM Account];
            return acc;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
}