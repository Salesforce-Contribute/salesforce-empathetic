/**
 * Covid Class Track covid recovery
 * */
public class Covid {
    private Integer recoveredInArea = 0;
    public static Integer recoveredInCountry = 0;

    // parameterized constructor to set class variables value
    public Covid(Integer recoveredInArea){
        if(recoveredInArea < 0){
            this.recoveredInArea = 0;
        } else{
            this.recoveredInArea = recoveredInArea;
            recoveredInCountry += recoveredInArea;
        }
    }

    // increment the count of recoveredInArea and recoveredInCountry by 1
    public void treatPatient(){
        recoveredInArea++;
        recoveredInCountry++;
    }

    // return the value of recoveredInArea
    public Integer getTreated() {
        return recoveredInArea;
    }
}