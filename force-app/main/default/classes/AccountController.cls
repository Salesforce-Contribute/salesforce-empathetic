public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
    return [SELECT Id, OwnerId, Name, Industry, Phone FROM Account order by createdDate desc LIMIT 5];
  }

    @AuraEnabled
    public static void deleteAccount(String accountId) {
    Database.delete(accountId);
  }
}