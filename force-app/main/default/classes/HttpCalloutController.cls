public with sharing class HttpCalloutController {
    
    @AuraEnabled
    public static String getApiData() {
        Http h = new Http();
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://dummyjson.com/users');
        req.setMethod('GET');
        req.setHeader('Accept', 'application/xml');
        
        HttpResponse res = h.send(req);
          
        return res.getBody(); 
    }
}