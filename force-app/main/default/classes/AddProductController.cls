public with sharing class AddProductController {
    public AddProductController() {

    }

    
    @AuraEnabled(cacheable=true)
    public static String searchProducts(String searchkey){
        System.debug('searhc:'+ searchkey);
        try{
            List<productWrap> productWrapList = new List<productWrap>();
            if(searchkey != ''){
                String searchValue = '%' + searchkey + '%';
                List<PricebookEntry> pbeList = [Select Id, Name, ProductCode, Product2Id, Product2.Name, Product2.ProductCode, UnitPrice From PricebookEntry Where Product2.Name like:searchValue OR Product2.ProductCode like:searchValue];
                System.debug('List>>>>>'+ pbeList);
                for(PricebookEntry product : pbeList){
                    productWrapList.add(new productWrap(product.Id, product.Product2Id, product.Name, product.ProductCode, product.UnitPrice));
                }
                
            }
            return JSON.serialize(productWrapList);
        } catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
    }

    @AuraEnabled(cacheable=true)
    public static String filterApply(String filterKey){
        System.debug('searhc:'+ filterKey);
        try{
            List<productWrap> productWrapList = new List<productWrap>();
            if(filterKey != ''){
                String filterValue = '%' + filterKey + '%';
                List<PricebookEntry> pbeList = [Select Id, Name, ProductCode, Product2Id, Product2.Name, Product2.ProductCode, UnitPrice From PricebookEntry Where Product2.ProductCode like:filterValue];
                System.debug('List>>>>>'+ pbeList);
                for(PricebookEntry product : pbeList){
                    productWrapList.add(new productWrap(product.Id, product.Product2Id, product.Name, product.ProductCode, product.UnitPrice));
                }
                
            }
            return JSON.serialize(productWrapList);
        } catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
    }
   

    @AuraEnabled(cacheable=true)
	public static String retrieveProducts(){
        
        List<productWrap> productWrapList = new List<productWrap>();
		try {
            List<PricebookEntry> pbeList = [Select Id, Product2Id, Product2.Name, ProductCode, UnitPrice From PricebookEntry LIMIT 10];
            for(PricebookEntry product : pbeList){
                productWrapList.add(new productWrap(product.Id, product.Product2Id, product.Product2.Name, product.ProductCode, product.UnitPrice));
            }
            return JSON.serialize(productWrapList);
            
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
        
	}

    @AuraEnabled
    public static List<OpportunityLineItemWrap> retrieveOpportunityLineItem(String fetchIds){
        String idList = fetchIds.removeEnd(',');  
        List<String> ProdIdList = idList.split(',');
        List<OpportunityLineItemWrap> lineItemListWrap = new List<OpportunityLineItemWrap>();
        //lineItemList = [SELECT Description,ListPrice,Name,OpportunityId,PricebookEntryId,Product2.Name,ProductCode,Quantity,ServiceDate,TotalPrice,UnitPrice FROM OpportunityLineItem where PricebookEntryId=:idList And OpportunityId =:oppRecId];
        List<PricebookEntry> pricebookEntryList = new List<PricebookEntry>();
        pricebookEntryList = [Select Id, Product2Id, Product2.Name, UnitPrice, ProductCode, Product2.Description  From PricebookEntry where id =:ProdIdList];
        for (PricebookEntry pricebookEntryObj : pricebookEntryList) {
            OpportunityLineItemWrap oppLineItemWrap = new OpportunityLineItemWrap();
            oppLineItemWrap.productName = pricebookEntryObj.Product2.Name;
            oppLineItemWrap.salesPrice = pricebookEntryObj.UnitPrice;
            oppLineItemWrap.PricebookEntryId = pricebookEntryObj.Id;
            oppLineItemWrap.Product2Id = pricebookEntryObj.Product2Id;
            oppLineItemWrap.productId = pricebookEntryObj.Product2Id;
            oppLineItemWrap.quantity = 0;
            oppLineItemWrap.serviceDate = System.today();
            oppLineItemWrap.lineDescription = '';
            lineItemListWrap.add(oppLineItemWrap);
        }
        //SYstem.assert(false, 'lineItemListWrap :: '+lineItemListWrap);
        return lineItemListWrap;
    }

    @AuraEnabled
    public static string updateProducts(Object data) {
        try {
            System.debug('UpdateProducts>>>>'+ data);
            return 'Success: updated successfully';
        }
        catch (Exception e) {
            return 'The following exception has occurred: ' + e.getMessage();
        }
    }

    public class OpportunityLineItemWrap
    {
        @AuraEnabled public String productId{get;set;}
        @AuraEnabled public String productName{get;set;}
        @AuraEnabled public Integer quantity{get;set;}
        @AuraEnabled public Double salesPrice{get;set;}
        @AuraEnabled public Date serviceDate{get;set;}
        @AuraEnabled public String lineDescription{get;set;}
        @AuraEnabled public String OpportunityId{get;set;}
        @AuraEnabled public String PricebookEntryId{get;set;}
        @AuraEnabled public String Product2Id{get;set;}
    }

    
    public class productWrap{
        public String Id;
        public String Product2Id;
        public String Name;
        public String ProductCode;
        public Decimal UnitPrice;
        public Boolean isSelected;

	    public productWrap(String Id, String Product2Id, String Name, String ProductCode, Decimal UnitPrice){
            this.Id = Id;
            this.Product2Id = Product2Id;
            this.Name = Name;
            this.ProductCode = ProductCode;
            this.UnitPrice = UnitPrice;
            this.isSelected = false;
		}
            
    }
}