/**
 * DML CHALLENGE
 * Create a new Account with the name “WingNut Films” and Rating “Warm”
 * Create a new Opportunity “Lord Of The Rings”  for this Account with below field values
 *                Stage > Qualification
 *                Closed Date > Today
 * Update Account Name to “New Line Cinema”
 * Update Opportunity Stage to “Closed-Won”
 * Delete the opportunity
 * Undelete the opportunity
 **/
public class Challenge11 {
	
    public static void createRecord() {
        Account acc = new Account();
        acc.Name = 'WingNut Films';
        acc.Rating = 'Warm';
        insert acc;
        String accountId = acc.Id;        
        opportunityForAccount(accountId);
    }
    
    public static void opportunityForAccount(String accountId) {
        Opportunity opp = new Opportunity();
        opp.AccountId = accountId;
        opp.Name = 'Lord of The Ring';
        opp.StageName = 'Qualification';
        opp.CloseDate = date.TODAY();        
    }
    
    public static void updateRecords() {
        /*Note : if we get only single record, then we store it without list collection */
        Account account = [SELECT Id, Name FROM Account WHERE Name = 'WingNut Films' LIMIT 1];
        account.Name = 'New Line Cinema';
        update account;

        Opportunity opportunity = [SELECT Id, Stagename FROM Opportunity WHERE StageName = 'Qualification' LIMIT 1];
        opportunity.StageName = 'Closed Won';
        update opportunity;
    }
    
    public static void deleteOpportunity() {
        Opportunity opp  = [SELECT Id FROM Opportunity WHERE Id = '0062w00000L8z1cAAB'];
        delete opp;
    }
    
    public static void getDeleted() {
        List<Opportunity> deleted = [SELECT Id, Name, StageName FROM Opportunity WHERE isDeleted=true ALL ROWS];
        undelete deleted;
    }
}