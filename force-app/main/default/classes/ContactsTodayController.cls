public class ContactsTodayController {

    @AuraEnabled
    public static List<Contact> getContactsForToday(){
        List<Task> myTask = [SELECT Id, Subject, WhoId FROM Task WHERE OwnerId = :UserInfo.getUserId() AND IsClosed = false AND WhoId != null];
        List<Event> myEvent = [SELECT Id, Subject, WhoId FROM Event WHERE OwnerId = :UserInfo.getUserId() AND StartDateTime >= :Date.today() AND WhoId != null];
        List<Case> myCase = [SELECT ID, ContactId, Status, Subject FROM Case WHERE OwnerId = :UserInfo.getUserId() AND IsClosed = false AND ContactId != null];
        
        Set<Id> contactIds = new Set<Id>();
        for(Task t : myTask){
            contactIds.add(t.WhoId);
        }
        for(Event e : myEvent){
            contactIds.add(e.WhoId);
        }
        for(Case c : myCase){
            contactIds.add(c.ContactId);
        }
        
        List<Contact> contacts = [SELECT Id, Name, Phone, Description FROM Contact WHERE Id IN :contactIds];
        
        for(Contact c : contacts){
            c.Description='';
            for(Task t : myTask){
                if(t.WhoId==c.Id){
                    c.Description += 'Because of task "'+t.Subject+'"\n';
                }
            }
            for(Event e : myEvent){
                if(e.WhoId==c.Id){
                    c.Description += 'Because of task "'+e.Subject+'"\n';
                }
            }
            for(Case cs : myCase){
                if(cs.ContactId==c.Id){
                    c.Description += 'Because of task "'+cs.Subject+'"\n';
                }
            }
        }
        return contacts;
    }
}