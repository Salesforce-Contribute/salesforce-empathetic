public class OpportunityChallenge {

    public static void updateProfile(List<Id> listId) {
        List<Opportunity> oppList = [SELECT Id, Name, Amount, Profile__c FROM Opportunity WHERE Id IN : listId];
        for(Opportunity opp : oppList) {
            if(opp.Amount == null) {
                 opp.Profile__c = '';
            }
            else if(opp.Amount < 10000) {
                opp.Profile__c = 'LOW';
            } 
            else if(opp.Amount > 50000) {
            	opp.Profile__c = 'HIGH';            
            } 
            else {
                opp.Profile__c = 'MEDIUM';
            }
        }
        update oppList;
    }
}


/*List<Opportunity> oppList = [SELECT Id FROM Opportunity];
List<Id> ids = new List<Id>();
for(Opportunity opp : oppList) {
    ids.add(opp.Id);
    ids.add(opp.Id);
    ids.add(opp.Id);
}
OpportunityChallenge.updateProfile(ids);*/