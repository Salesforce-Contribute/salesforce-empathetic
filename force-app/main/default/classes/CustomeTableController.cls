public with sharing class CustomeTableController {
    public CustomeTableController() {

    }

    @AuraEnabled(cacheable=true)
	public static String retrieveContact(){

        List<contactWrap> contWrapList = new List<contactWrap>();
		try {
            List<Contact> contList = [SELECT Id, Account.Name, Name, Amount__c, Owner.Name FROM Contact where AccountId != null WITH SECURITY_ENFORCED ];
            for(Contact c : contList){
                contWrapList.add(new contactWrap(c.Id, c.Account.Name, c.Name, c.Amount__c, c.Owner.Name));
            }
            return JSON.serialize(contWrapList);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
    

    @AuraEnabled
    public static String updateAmount(String recordId, Object data) {
        System.Debug(' data ' + data);
        List<Contact> con = new List<Contact>();
        List<WrapperRequest> updateForAmount = (List<WrapperRequest>) JSON.deserialize(JSON.serialize(data),List<WrapperRequest>.class);
        for(WrapperRequest wr : updateForAmount)
        {
            con.add(new Contact(Id = wr.Id, Amount__c = wr.amount));
        }
        System.Debug(' updateForAmount ' + updateForAmount);
        if(con.size() == 0)
               throw new AuraHandledException('Please select the correct record to update');
        try {
            update con;
            return 'success';
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class WrapperRequest
    {
        Decimal amount;
        String id;
    }

    
    public class contactWrap{
        public String Id;
        public String AccountName;
        public String Name;
        public Decimal Amount;
        public String OwnerName;
        public Boolean isSelected;

	    public contactWrap(String Id, String AccountName, String Name, Decimal Amount, String OwnerName){
            this.Id = Id;
            this.AccountName = AccountName;
            this.Name = Name;
            this.Amount = Amount;
            this.OwnerName = OwnerName;
            this.isSelected = false;
		}
            
     }
}