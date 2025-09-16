public class Challenge5 {

    public static void main() {
        Integer i=0, j=1, sum=0;
        while(i<18){
            sum = i+j;
            System.debug(sum);
			i=j;
            j=sum;
        }
    }
}