public with sharing class customAddProductController {
    public customAddProductController() {

    }

    @AuraEnabled
    public static String findProducts(String recordId , String name , String productCode , List<String> productFamily, Integer RecordLimit) {
        
        Opportunity op = [SELECT Id , Pricebook2Id, Pricebook2.Name FROM Opportunity WHERE Id =:recordId];
        wrapperClass wc = new wrapperClass();
        If(op.Pricebook2Id != null){
            wc.priceBook = op.Pricebook2.Name;
        }
        String ProductQuery = 'SELECT Id,Family,Description,ProductCode,Name FROM Product2 WHERE Id IN (SELECT Product2Id FROM PricebookEntry WHERE Pricebook2Id = \''+ op.Pricebook2Id +'\' AND IsActive = true)';
        
        // Add Product Family filter if provided
        If(productFamily != null && productFamily.size() != 0 ){
            ProductQuery += ' AND Family IN :productFamily';
        }
        
        // Add Product Code filter if provided
        If(productCode != null && productCode != ''){
            ProductQuery += ' AND ProductCode LIKE \'%' + String.escapeSingleQuotes(productCode.trim()) + '%\'';
        }
        
        // Add Name filter if provided
        If(name != null && name != ''){
            ProductQuery += ' AND Name LIKE \'%' + String.escapeSingleQuotes(name.trim()) + '%\'';
        }
        
        // Add limit if any filter is applied
        if((name != null && name != '') || (productCode != null && productCode != '') || (productFamily != null && productFamily.size() != 0)){
            ProductQuery += ' LIMIT ' + RecordLimit;
        }
        
        System.debug('ProductQuery: ' + ProductQuery);
        List<Product2> products = Database.query(ProductQuery);
        Map<Id,Product2> mapProduct = new Map<Id,Product2>(products);
        List<ProductWrapper> lstProduct= new List<ProductWrapper>();
        List<Id> lstProductIds = new List<Id>(mapProduct.keyset());
        
        String query = 'SELECT Id ,UnitPrice,Product2Id  FROM PricebookEntry WHERE Pricebook2Id = \''+ op.Pricebook2Id +'\' AND IsActive = true AND Product2Id IN :lstProductIds';
       
        System.debug(query);
        List<PricebookEntry> lstPBE = (List<PricebookEntry>)Database.query(query);
        if(lstPBE != null && lstPBE.size() != 0){
            for(PricebookEntry pbe : lstPBE){
                ProductWrapper pw = new ProductWrapper();
                Product2 p2 = mapProduct.get(pbe.Product2Id);
                if(p2 != null){
                    pw.Id = pbe.Id;
                    pw.purl = '/lightning/r/' +pbe.Id+'/view';
                    pw.Product2Id = p2.Id;
                    pw.Name =p2.Name;
                    pw.Family = p2.Family;
                    pw.ProductCode = p2.ProductCode;
                    pw.Description= p2.Description;
                    pw.Price = pbe.UnitPrice;
                    lstProduct.add(pw);
                }
            }
        }
        wc.productList = lstProduct;
        return JSON.serialize(wc);
    }
   
    @AuraEnabled
    public static List<PicklistValue> getproductfamily(){
        String strObjectName = 'Product2';
        String strPicklistField = 'Family';
        Map<String, String> mapPickListValues = new Map<String, String>();
        Schema.SObjectType objSobjectType = Schema.getGlobalDescribe().get(strObjectName);
        Schema.DescribeSObjectResult objDescribeSobject = objSobjectType.getDescribe();
        Map<String, Schema.SObjectField> mapFields = objDescribeSobject.fields.getMap();
        List<Schema.PicklistEntry> lstPickListValues = mapFields.get(strPicklistField).getDescribe().getPickListValues();
        List<PicklistValue> pvList = new List<PicklistValue>();
        for (Schema.PicklistEntry objPickList : lstPickListValues) {
            PicklistValue pv = new PicklistValue(objPickList.getValue(), objPickList.getLabel());
            pvList.add(pv);
        }
        return pvList;
    }
   
    @AuraEnabled
    public static String saveProducts( String recordData, String recId ){
       
        List<ProductWrapper> wc  = (List<ProductWrapper>)json.deserialize(recordData, List<ProductWrapper>.class);
        List<OpportunityLineItem> lstOpp = new List<OpportunityLineItem>();
        for(ProductWrapper pw : wc){
            System.debug(' pw' + pw);
            OpportunityLineItem oli = new OpportunityLineItem();
            oli.Quantity = pw.Quantity;
            oli.UnitPrice = pw.Price;
            oli.ServiceDate = pw.PDate;
            oli.Description = pw.LineDescription;
            oli.OpportunityId = recId;//'0065j00000N2RXiAAN';
            oli.Product2Id = pw.Product2Id;
            oli.PricebookEntryId = pw.Id;//'01u5j000003Pq51AAC';
            lstOpp.add(oli);
        }
        try {
            insert lstOpp;
            return 'success';
        } catch (Exception e) {
            System.debug(e.getMessage());
            return 'error';
        }        
    }
   
    public with sharing class wrapperClass {
        public String priceBook;
        public List<ProductWrapper> productList;
    }
   
    public with sharing class ProductWrapper {
        public String Name;
        public String Id;
        public String purl;
        public String Product2Id;
        public String ProductCode;
        public Decimal Price;
        public Decimal Quantity = 0;
        public String Family;
        public Date PDate;
        public String Description;
        public String LineDescription;
    }
   
    public class PicklistValue {
        @auraenabled
        public String label {get;set;}
        @auraenabled
        public String value {get;set;}
       
        public PicklistValue(String value, String label) {
            this.value = value;
            this.label = label;
        }
    }
}