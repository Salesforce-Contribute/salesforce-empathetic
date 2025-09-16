public class Company {
    
    public String companyName;
    public String ceo;
    public Integer employeeCount;
    public Long revenu;
    
    List<Customer> customerList = new List<Customer>();
    
    public void addNewCustomer(String name, String website, String email, Long phone) {
        Customer customer = new Customer(name, website, email, phone);
        customerList.add(customer);
    }
    
    public void getAllCustomer() {
        for(Customer cust : customerList) {
            System.debug(cust.name+' '+cust.website+' '+cust.email+' '+cust.phone);
        }
    }
    
    private class Customer {
        public String name;
        public String website;
        public String email;
        public Long phone;
        
        public Customer(String name, String website, String email, Long phone) {
            this.name = name;
            this.website = website;
            this.email = email;
            this.phone = phone;
        }
    }

}