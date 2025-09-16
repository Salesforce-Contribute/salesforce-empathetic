/*
 * Challenge1 : Suppose you have post data with cateogory. So you have to store it.
 * Example 
 * 1. Apex
 * 		Demystifying Apex Collection
 * 		Data Types and Variable in Apex
 * 2. Lightning
 * 		Events in Aura Framework
 * 		Developing reuseable Components
*/

public class Challenge1 {

    public static void post() {
        
   	 	List<String> apexPost = new List<String>();
        apexPost.add('Demystifying Apex Collection');
        apexPost.add('Data Types and Variable in Apex');
        
        List<String> lightningPost = new List<String>();
        lightningPost.add('Events in Aura Framework');
        lightningPost.add('Developing reuseable Components');
        
        Map<String, List<String>> mp = new Map<String, List<String>>();
        mp.put('Apex', apexPost);
        mp.put('Lightning', lightningPost);
        
        System.debug(mp);
        
        
    }
}