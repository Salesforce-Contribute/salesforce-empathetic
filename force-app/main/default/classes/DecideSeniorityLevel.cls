public class DecideSeniorityLevel {

    public static void sniorityLevel() {
        // First, instantiate a new Pattern object "MyPattern"
        Pattern MyPattern = Pattern.compile('a*b');
        
        // Then instantiate a new Matcher object "MyMatcher"
        Matcher MyMatcher = MyPattern.matcher('aaaaab');
        
        // You can use the system static method assert to verify the match
        System.debug(MyMatcher.matches());
    }
}