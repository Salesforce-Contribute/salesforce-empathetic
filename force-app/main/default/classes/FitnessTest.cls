@isTest
public class FitnessTest {
    
    @isTest
    public static void calculateBMITest() {
        Fitness fit = new Fitness();
        Decimal bmi = fit.calculateBMI(53, 1.53);
        System.assertEquals(22.64, bmi.setScale(2));
        
        Decimal bmi2 = fit.calculateBMI(0, 1.53);
        System.assertEquals(0, bmi2.setScale(2));
        
        // Test exception
        Decimal bmi3 = fit.calculateBMI(53, 0);
        System.assertEquals(0, bmi3.setScale(2));        
    }
    
    @isTest
    public static void calculateBMITestNegative() {
        Fitness fit = new Fitness();
        Decimal bmi1 = fit.calculateBMI(-53, 1.53);
        System.assertEquals(0, bmi1.setScale(2));
        
        Decimal bmi2 = fit.calculateBMI(53, -1.53);
        System.assertEquals(22.64, bmi2.setScale(2));
    }
    
    @isTest
    public static void calculatePaceTest() {
        Fitness fit = new Fitness();
        
        Decimal pace1 = fit.calculatePace(10, 60);
        System.assertEquals(10, pace1);
        
        Decimal pace2 = fit.calculatePace(60, 10);
        System.assertEquals(360.00, pace2.setScale(2)); 
    }
    
    @isTest
    public static void calculatePaceNegativeTest() {
        Fitness fit = new Fitness();
        
        Decimal pace1 = fit.calculatePace(-10, 60);
        System.assertEquals(-10, pace1);
        
        Decimal pace2 = fit.calculatePace(10, -60);
        System.assertEquals(-10, pace2);
        
        Decimal pace3 = fit.calculatePace(10, 0);
        System.assertEquals(0, pace3);
    }

}