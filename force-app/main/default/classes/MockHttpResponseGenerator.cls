@isTest
global class MockHttpResponseGenerator implements HttpCalloutMock {
        // Implement this interface method
        global HTTPResponse respond(HTTPRequest req) {
        
        // Optionally, only send a mock response for a specific endpoint and method.
        System.assertEquals('https://th-apex-http-callout.herokuapp.com/animals', req.getEndpoint());
        System.assertEquals('GET', req.getMethod());
        
        // Create a fake response
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"animals":["majestic badger","fluffy bunny","scary bear","chicken"]}');
        res.setStatusCode(200);
        return res;
    }
}