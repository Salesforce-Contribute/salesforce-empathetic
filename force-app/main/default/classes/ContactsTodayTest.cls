@isTest
private class ContactsTodayTest {
    
    @isTest static void testMethodContact(){
        Set<Id> contactId = new Set<Id>();
        String actualValues = '';
        Test.startTest();
        Contact cntObj = new Contact(FirstName='test', LastName='tests', Description='Desctest');
        insert cntObj;
        
        Task tobj = new Task(Subject='testTask', WhoId=cntObj.Id);
        insert tobj;
        
        Event eobj = new Event(Subject='testEvent', WhoId=cntObj.Id, DurationInMinutes=14, ActivityDateTime=System.Today());
        insert eobj;
        
        Case cobj = new Case(Subject='testCase', ContactId=cntObj.Id);
        insert cobj;
       
        actualValues = 'Because of task "'+tobj.Subject+'"\n';
        actualValues += 'Because of task "'+eobj.Subject+'"\n';
        actualValues += 'Because of task "'+cobj.Subject+'"\n';
            
       	List<Contact> contactList = ContactsTodayController.getContactsForToday();
        
       	System.assertEquals(actualValues, contactList[0].Description);
        Test.stopTest();
    }

    /*@isTest static void testMethodContact(){
        Set<Id> contactId = new Set<Id>();
        
        Test.startTest();
        Contact cntObj = new Contact(FirstName='test', LastName='tests', Description='Desctest');
        insert cntObj;
        
        Task tobj = new Task(Subject='testTask', WhoId=cntObj.Id);
        insert tobj;
        
        Event eobj = new Event(Subject='testEvent', WhoId=cntObj.Id, DurationInMinutes=14, ActivityDateTime=System.Today());
        insert eobj;
        
        Case cobj = new Case(Subject='testCase', ContactId=cntObj.Id);
        insert cobj;
        
        List<Task> taskList = [SELECT Id, Subject, WhoId FROM Task];
        List<Event> eventList = [SELECT Id, Subject, WhoId FROM Event];
        List<Case> caseList = [SELECT ID, ContactId, Status, Subject FROM Case];
       
	        
        List<Contact> contacts = [SELECT Id, Name, Phone, Description FROM Contact];
        
        for(Contact c : contacts){
            c.Description='';
            for(Task t : taskList){
                if(t.WhoId==c.Id){
                    c.Description += 'Because of task "'+t.Subject+'"\n';
                }
            }
            for(Event e : eventList){
                if(e.WhoId==c.Id){
                    c.Description += 'Because of task "'+e.Subject+'"\n';
                }
            }
            for(Case cs : caseList){
                if(cs.ContactId==c.Id){
                    c.Description += 'Because of task "'+cs.Subject+'"\n';
                }
            }
        }
            
       	List<Contact> actualValue = ContactsTodayController.getContactsForToday();
        
       	System.assertEquals(contacts, actualValue);
        Test.stopTest();
    }*/
}