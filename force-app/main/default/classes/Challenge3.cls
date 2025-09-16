public class Challenge3 {

    public static void isLeapYear() {
        Integer year = 2528;
        
        if(Math.mod(year, 4)==0){
            if(Math.mod(year, 100)==0){
                if(Math.mod(year, 400)==0){
                    System.debug(year+' is leap year');
                } else {
                    System.debug(year+' is not leap year');
                }
            } else {
                System.debug(year+' is leap year');
            }
        } else {
            System.debug(year+' is not leap year');
        }    
       		
        
    }
}