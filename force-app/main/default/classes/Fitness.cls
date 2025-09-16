public class Fitness {

    public Decimal calculateBMI(Decimal bodyWeight, Decimal bodyHeight) {
        try{
            Decimal bmi= bodyWeight / (bodyHeight * bodyHeight);
            if(bmi < 0){
                bmi = 0;
            }
            return bmi;
            
        } catch(Exception e) {
            return 0;
        }

    }
    
    public Decimal calculatePace(Decimal distance, Decimal minutes) {
        try{
           Decimal hour = minutes/60;
           Decimal pace = distance / hour;
           return pace;
        } catch(Exception e) {
            return 0;
        }
        
    }
}