public class UserTimeController {
    public String userTimeZoneInfo {get; set;}
    public String userTime {get; set;}
   
    
    public UserTimeController() {
        Case cs = [SELECT Id, casenumber, CreatedDate FROM Case ORDER BY CreatedDate DESC LIMIT 1];
        TimeZone tz = UserInfo.getTimeZone();
        userTimeZoneInfo = tz.getDisplayName();
        String userTimeZoneId = UserInfo.getTimeZone().getID();
        DateTime currentTime = cs.CreatedDate;
        userTime = currentTime.format('MM-dd-yyyy HH:mm:ss', userTimeZoneId);
    }
}