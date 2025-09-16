public with sharing class SampleClassDescriptor {
    
    @AuraEnabled(cacheable=true)
    public static List<String> getList() {
        // Fetch your list here, for example:
        List<String> myList = new List<String>{'item1', 'item2', 'item3'};
        return myList;
    }

    @InvocableMethod(label='Get List' description='Invocable method to get a list')
    public static List<List<String>> getListInvocable() {
        List<List<String>> outerList = new List<List<String>>();
        List<String> innerList = getList();
        outerList.add(innerList);
        return outerList;
    }
 
    /*@AuraEnabled
    public String field1;
 
    @AuraEnabled
    public String field2;
 
    @AuraEnabled
    public Boolean field3;
 
    @AuraEnabled
    public Integer field4;*/
}