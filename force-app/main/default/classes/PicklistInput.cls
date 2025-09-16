public with sharing class PicklistInput {
    public PicklistInput() {

    }

    @AuraEnabled
    public static string jobScheduler(String data) {
        try {
            System.debug('Time====>'+ data);
            return 'Time got';
        }
        catch (Exception e) {
            return 'The following exception has occurred: ' + e.getMessage();
        }
    }
}