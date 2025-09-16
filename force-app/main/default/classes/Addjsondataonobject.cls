public class Addjsondataonobject {
   
    public static void parseJSONString() {
        String jsonStr = '{"eventData" :[{"attributes":{"type":"Account"},"Name":"Test Account"}, {"attributes":{"type":"Account"},"Name":"Test Account"}], "UpdateField" : "test__c"}';
        
        Map<String, Object> parsed = (Map<String, Object>) JSON.deserializeUntyped(jsonStr);
        System.debug('parsed >> '+parsed.get('UpdateField'));
        System.debug('eventData => '+ parsed.get('eventData'));
        //String listData = String.valueOf(parsed.get('eventData'));
        //String fieldName = String.valueOf(parsed.get('UpdateField'));
        /*
        List<String> parsedEventData = (List<String>)JSON.deserializeUntyped(listData);
        for(Object obj : parsedEventData) {
            Map<String, Object> data = (Map<String, Object>)obj;
            System.debug(data.get('Name'));
        }
*/
        //List<Map<String,Object>> lstMinorEnrolledBy = (List<Map<String,Object>>) JSON.deserialize(parsed.get('eventData'), List<Map<String,Object>>.class);
        //System.debug('lstMinorEnrolledBy >> '+lstMinorEnrolledBy);
        
        /*String jp = (String) parsed.get('eventData');
        List<Map<String,String>> lstMinorEnrolledBy = (List<Map<String,String>>) JSON.deserializeUntyped(jp, List<Map<String,String>>.class);
        System.debug(lstMinorEnrolledBy);
        List<Object> parsedEventData = (List<Object>)parsed.get('eventData');
        /*System.debug(parsedEventData);
        List<Account> listAcc = new List<Account>();
        Account acc = new Account();*/
        
         	
        //for(Integer i=0; i<parsedEventData.size(); i++) {
           	//String jp = (String) parsedEventData[i];
            //List<Map<String,String>> lstMinorEnrolledBy = (List<Map<String,String>>) JSON.deserialize(jp, List<Map<String,String>>.class);
			
            /*String attributeType = 'Account';
            String name = 'Test test account';
            if(attributeType=='Account') {
                acc.Name = name;
                listAcc.add(acc);
            }*/
        //}
        //insert listAcc;
        //Map<String, Object> parsedAttribute = (Map<String, Object>)parsedEventData[0];
       
        
    }
}