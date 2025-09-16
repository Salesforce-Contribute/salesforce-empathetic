@isTest
private class CovidTest {

    @isTest
    public static void treatPatientTest(){
        //Test for jaipur area
        Covid jaipur = new Covid(2);
        Integer recoverdInJaipur = jaipur.getTreated();
        System.assertEquals(2, recoverdInJaipur);
        
        // Test for pune area
        Covid pune = new Covid(5);
        Integer recoverdInPune = pune.getTreated();
        System.assertEquals(5, recoverdInPune);
        
        // Test for all state or india
        System.assertEquals(7, Covid.recoveredInCountry);
        
        // Test for increment recovery in jaipur area
        jaipur.treatPatient();        
        recoverdInJaipur = jaipur.getTreated();
        System.assertEquals(3, recoverdInJaipur);
        
        // Test for increment recovery in pune area
        pune.treatPatient();
        recoverdInPune = pune.getTreated();
        System.assertEquals(6, recoverdInPune);
        
        // Test for after increment in all state or country
        System.assertEquals(9, Covid.recoveredInCountry);
    }
    
    @isTest
    public static void treatPatientTestNegative() {
        Covid jaipur = new Covid(-4);
        System.assertEquals(0, jaipur.getTreated());
        
        Covid pune = new Covid(-4);
        System.assertEquals(0, pune.getTreated());
    }
}