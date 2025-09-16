@isTest
private class AnimalsCalloutsTest {

    @isTest static void testGetAnimals(){
        Test.startTest();
        List<String> apiMethodName = new List<String>();
        apiMethodName.add('GET');
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        List<Object> actual = AnimalsCallouts.getAnimals(apiMethodName);
        List<Object> value = new List<Object>{'majestic badger','fluffy bunny','scary bear','chicken'};
        System.assertEquals(value, actual);
        Test.stopTest();
    }
    
    @isTest static void testGetAnimals_Negative(){
        Test.startTest();
        try{
            //Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());  
            List<Object> actual = AnimalsCallouts.getAnimals(null);
        } catch(Exception e){
            Assert.isNotNull(e.getMessage());
        }
        Test.stopTest();
    }
}