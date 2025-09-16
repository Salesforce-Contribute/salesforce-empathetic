/* 
 * Fizzbuzz problem
 * Print all number 0 t0 100 But includes certain conditions...
 * If number is divisible by 3 print 'fizz' instead of the number
 * If number is divisible by 5 print 'buzz' instead of the number
 * If a number divisible 3 & 5 print 'fizzbuzz' instead of the number
*/
public class Challenge4 {

    public static void fizzbuzz() {
        Integer num = 0;
        do {
            if(Math.mod(num, 3)==0 && Math.mod(num, 5)==0){
                System.debug('fizzbuzz');
            }
            else if(Math.mod(num, 3)==0){
                System.debug('fizz');
            }
            else if(Math.mod(num, 5)==0){
                System.debug('buzz');
            }
            else {
                System.debug(num);
            }
            num++;
        } while(num <=100);
    }
}