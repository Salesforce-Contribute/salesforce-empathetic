public class Challenge2 {
	public final Integer PRICE_ONE_OPT = 8, PRICE_BW_OPT = 7, PRICE_GREATER_OPT = 6;
    public Double bill=0;
    
    public double generateBill(Integer numOfSlice){
        bill = (numOfSlice == 1) ? PRICE_ONE_OPT * numOfSlice : (numOfSlice > 1 && numOfSlice < 4) ? PRICE_BW_OPT * numOfSlice : PRICE_GREATER_OPT * numOfSlice;
		return bill;
    }
}

/*
-----How to execute the class on Anonymous window----

Challenge2 bill = new Challenge2();
System.debug('Ross has to pay = $'+bill.generateBill(3));
System.debug('Chandler has to pay = $'+bill.generateBill(1));
System.debug('Joey has to pay = $'+bill.generateBill(4));

*/