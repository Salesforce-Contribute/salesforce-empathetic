public class Example {
    
    public Example() {
        System.debug('I am constructor');
    }
    
    {
        System.debug('I am code block');
    }
    
    static {
        System.debug('I am static code block');
    }  
    
    public static void getAccounts() {
        List<Contact> contacts = [SELECT Id, Name FROM Contact LIMIT 5];
        for(Contact con : contacts) {
            System.debug(con.get('Id')+ ' : '+ con.get('Name') +' : '+ con.getSObject('AccountId'));
        }
    }
    
    public static void updateAccountIdOnContact() {
     
            List<Contact> contacts = [SELECT Id, FirstName, LastName, IndividualId FROM Contact WHERE IndividualId=null ORDER BY LastModifiedDate DESC];
            List<Contact> contList = new List<Contact>();
        	List<Individual> indList = new List<Individual>();
            List<String> indIds = new List<String>();
        	Set<String> ids = new Set<String>();
        
            for(Integer i=0; i<contacts.size(); i++) {
                Individual ind = new Individual();
                if(contacts[i].IndividualId==null) {
                    //ind.Name = contacts[i].FirstName+' '+contacts[i].LastName;
                    ind.FirstName = contacts[i].FirstName;
                    ind.LastName = contacts[i].LastName;
                }
                indList.add(ind);
                
                if(Integer.valueOf(contacts.size())==i+1){
                  
                	Database.SaveResult[] results = Database.insert(indList, true); 
                    for (Database.SaveResult saveResult : results) {
                      if (saveResult.isSuccess()) {
                          Id indId = saveResult.getId();
                          indIds.add(indId);
                          System.debug(indIds);
                      } else {
                        // Handle errors (optional)
                        for (Database.Error error : saveResult.getErrors()) {
                          System.debug('Error: ' + error.getStatusCode() + ' - ' + error.getMessage());
                        }
                      }
                    }
                }
                
                if(Integer.valueOf(indIds.size()) == Integer.valueOf(contacts.size())) {
                    for(Integer j=0; j<indIds.size(); j++){
                        contacts[j].IndividualId = indIds[j]; 
                        ids.add(indIds[j]);
                        contList.add(contacts[j]);  
                    }   
                }           
            }
        
            upsert contList;
        
    }
}