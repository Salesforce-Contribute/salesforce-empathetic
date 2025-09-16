public class MyHelloWorld {

    public static void applyDiscount(Book__c[] books){
        for(Book__c c : books){
            c.price__c *= 0.9;
        }
    }
}