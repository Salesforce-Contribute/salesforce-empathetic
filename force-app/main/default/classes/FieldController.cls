public with sharing class FieldController {
    public FieldController() {

    }

    @AuraEnabled
    public static List<String> showAllFields() {
        List<String> field = new List<String>();
        //Map<String, String> mapField = new Map<String, String>();
        String objectName = 'Boat__c'; // or any other object
        //String query = 'SELECT ';

        // Describe the object and get all field names
        Schema.SObjectType objectType = Schema.getGlobalDescribe().get(objectName);
        Schema.DescribeSObjectResult describeResult = objectType.getDescribe();
        Map<String, Schema.SObjectField> fields = describeResult.fields.getMap();

        for (String fieldName : fields.keySet()) {
            System.debug(fieldName+' => '+ fields.get(fieldName));
            //mapField.put(fieldName, fields.get(fieldName).getDescribe().getLabel());
            field.add(fieldName);
            //query += fieldName + ', ';
        }

        // Remove the trailing comma and space
        //query = query.substring(0, query.length() - 2);
        //query += ' FROM ' + objectName;

        //System.debug('Dynamic SOQL Query: ' + query);

        // Execute the dynamic query
        //List<SObject> records = Database.query(query);
        return field;
    }

    @AuraEnabled
    public static List<String> getPageLayoutFields(String objectName){
        List<String> fields = new List<String>();
        String layoutName = '';
        if (objectName.endsWith('__c')) {
            String rmu = objectName.replace('_', ' ');
            layoutName = rmu.substring(0, rmu.length() - 3);
        } else {
            layoutName = objectName;
        }
        String objwithlayout = objectName+'-'+layoutName+' layout';
        System.debug(objwithlayout);
        List < Metadata.Metadata > pageLayouts = Metadata.Operations.retrieve(
            Metadata.MetadataType.Layout, new List < String > { objwithlayout }
        );
        for ( Metadata.Metadata objPageLayout : pageLayouts ) {
            Metadata.Layout layout = ( Metadata.Layout )objPageLayout;
            for ( Metadata.LayoutSection section : layout.layoutSections ) {   
                System.debug('Section: '+ section); 
                for ( Metadata.LayoutColumn column : section.layoutColumns ) {        
                    if (column.layoutItems != null) {            
                        for ( Metadata.LayoutItem item : column.layoutItems ) {  
                            if(item.field!='CreatedById' && item.field!='LastModifiedById')              
                                fields.add(item.field);               
                        }
                    }
                }
            }
        }
        return fields;
    }
}