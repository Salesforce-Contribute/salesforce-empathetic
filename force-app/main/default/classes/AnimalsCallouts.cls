public class AnimalsCallouts {
 @AuraEnabled
    public static List<Object> getAnimals(List<String> apiMethodName)
    {
        try
        {
            List<Object> animals = new List<Object>();
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://th-apex-http-callout.herokuapp.com/animals');
            request.setMethod(apiMethodName[0]);
            HttpResponse response = http.send(request);
            if(response.getStatusCode() == 200)
            {
                Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
                animals = (List<Object>) results.get('animals');
                System.debug(response.getBody());
            }
            return animals;
        }
        catch(Exception ex)
        {
            throw new AuraHandledException(ex.getMessage());
        }
    }
}