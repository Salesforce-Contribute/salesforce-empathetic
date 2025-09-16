@isTest
private class HelloWorldTestClass {
    
    @isTest static void validateHelloWorld(){
        Book__c b = new Book__c(Name='Behind the cloud', Price__c=100);
        System.debug('Price before inserting new book:'+ b.Price__c);
        
        //Insert the book;
        insert b;
        
        //Retrieve the new book
        b = [Select Price__c From Book__c Where Id =: b.Id];
        System.debug('Price after trigger fired:'+ b.Price__c);
        
        //Test that the trigger correctly update the price
        System.assertEquals(90, b.Price__c);
    }

}