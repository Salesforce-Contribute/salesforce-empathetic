@isTest
private class ContactTriggerHelperTest {
    
    @isTest static void testValidatePrimaryContact(){
        try{
			Test.startTest();
            Account acctObj = new Account(Name='test', Email__c='test@gmail.com');
            insert acctObj;
            
            Contact contObj1 = new Contact(FirstName='test1', LastName='tests1', AccountId=acctObj.Id, Primary_Contact__c=true, Email='contact@gmail.com');
            insert contObj1;
            Contact contObj2 = new Contact(FirstName='test2', LastName='tests2', AccountId=acctObj.Id, Primary_Contact__c=true, Email='contact@gmail.com');
            insert contObj2;
            
        	Test.stopTest();            
        }catch(Exception e) {
            Boolean error = e.getMessage().contains('Single account cannot have multiple primary contacts. Parent account already has the primary contact.') ? true : false;
            System.assertEquals(error, true);
        } 	    
    }
   
    @isTest static void testUpdatePrimaryContacts_forSuccess() {
        String actual='';
        try {
            List<String> ids = new List<String>();
            Account acctObj = new Account(Name='test', Email__c='test@gmail.com');
            insert acctObj;
            Contact contObj1 = new Contact(FirstName='test1', LastName='tests1', AccountId=acctObj.Id, Primary_Contact__c=true, Email='contact@gmail.com');
            insert contObj1;
            Contact contObj2 = new Contact(FirstName='test2', LastName='tests2', AccountId=acctObj.Id, Primary_Contact__c=false, Email='contact@gmail.com');
            insert contObj2; 
            
            ids.add(contObj2.Id);
            
            actual = ContactTriggerHelper.updatePrimaryContacts(acctObj.Id, ids);
        	System.assertEquals('Selected contact has been updated successfully.', actual);
        } catch(Exception e){
            System.assertNotEquals(e.getMessage(), actual);
        }
    }
    
   @isTest static void testUpdatePrimaryContacts_forError() {
       String actual = '';
        try {
            Account acctObj = new Account(Name='test', Email__c='test@gmail.com');
            insert acctObj;
            
            actual = ContactTriggerHelper.updatePrimaryContacts(acctObj.Id, NUll);
        	System.assertNotEquals('Selected contact has been updated successfully.', actual);
        } catch(Exception e){
            System.assertEquals(e.getMessage(), actual);
        }
    }
    
}