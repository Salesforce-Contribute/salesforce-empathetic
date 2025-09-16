public with sharing class EmailSchedulerController implements Schedulable {

    public void execute(SchedulableContext ctx) {
        // Reschedule job after 5 minutes

        System.debug('schedule job execute');

    }    
}