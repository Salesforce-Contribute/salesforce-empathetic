global class ContactTriggerHelper {

    public static void validatePrimaryContact(List<Contact> newContacts){
        Set<String> accIds = new Set<String>();
        
        for(Contact c: newContacts){
            if(c.accountId != null){
                accIds.add(c.accountId);
            }
        }
        
        Map<String, Boolean> accMap = new Map<String, Boolean>();
        
        for(Contact c : [select id,accountid,Primary_Contact__c from Contact where accountId IN: accIds AND Primary_Contact__c = TRUE AND id NOT IN: newContacts]){
            if(!accMap.containsKey(c.accountId)){
                accMap.put(c.accountId, c.Primary_Contact__c);
            }
        }
        
        for(Contact c : newContacts){
            if(accMap.containsKey(c.accountId) && c.Primary_Contact__c){
                c.Primary_Contact__c.addError('Single account cannot have multiple primary contacts. Parent account already has the primary contact.');
            }
        }
    }
    
    public static void updateAccountEmail(List<Contact> newContacts, Map<Id, Contact> oldCons){
        List<Account> accList = new List<Account>();
        for(Contact c: newContacts){
            if(c.Primary_Contact__c && c.Email !=null){
                if((oldCons != null && (oldCons.get(c.id).Email != c.Email || oldCons.get(c.id).Primary_Contact__c != c.Primary_Contact__c)) || (oldCons == null)){
                    accList.add(new Account(id=c.accountId, Email__c=c.Email));
                }
                
            }
        }
        if(!accList.isEmpty()){
            update accList;
        }
    }
    
    static webservice string updatePrimaryContacts(string accId,List<string> ids){
        string status;
        try{
            List<Contact> conList = new List<Contact>();
            for(Contact con: [select id,accountId,Primary_Contact__c from contact where id IN: ids]){
                con.Primary_Contact__c = true;
                conList.add(con);
            }
            for(Contact con: [select id,Primary_Contact__c from contact where accountId =: accId AND Primary_Contact__c = true AND id NOT IN: ids]){
                con.Primary_Contact__c = false;
                conList.add(con);
            }
            
            if(!conList.isEmpty()){
                update conList;
            }
            
            status = 'Selected contact has been updated successfully.';
        }
        catch(Exception ex){
             status = 'Error: '+ex.getMessage();
        }
        return status;
    }
}