public with sharing class EmailScheduleJobController {
    public static Integer durationMinutes {get; set;}
    public static String jobName {get; set;}
    public static String jobID {get; set;}
    
    @AuraEnabled
    public static boolean startScheduleJob(Integer minutesInterval) {
        try {
            durationMinutes = Integer.valueOf(minutesInterval);
            jobName = 'ChangeAlert_' + durationMinutes;

            EmailSchedulerController obj = new EmailSchedulerController();
            Integer jobsPerHour = 60 / durationMinutes;
            for (Integer i = 0; i < jobsPerHour; i++) {
                Integer startMinute = i * durationMinutes;
                String cronExp = '0 ' + startMinute + ' * * * ?';
                jobID = System.schedule(jobName+'_'+startMinute, cronExp, obj);
            }

            List<CronTrigger> jobsToResume = [SELECT Id, State, CronJobDetail.Name FROM CronTrigger WHERE CronJobDetail.Name LIKE 'ChangeAlert_%'];
            if (jobsToResume[0].State == 'WAITING') {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static boolean stopScheduleJob() {
        try {
            List<CronTrigger> jobsToPause = [SELECT Id, CronJobDetail.Name FROM CronTrigger WHERE CronJobDetail.Name LIKE 'ChangeAlert_%'];
            
            for (CronTrigger ct : jobsToPause) {
                System.pauseJobById(ct.Id);
            }
            
            String status = [SELECT State FROM CronTrigger WHERE CronJobDetail.Name LIKE 'ChangeAlert_%'][0].State;
            if (status == 'PAUSED') {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
   	}

    @AuraEnabled
    public static boolean resumeScheduleJob() {
        try {
            List<CronTrigger> jobsToResume = [SELECT Id, CronJobDetail.Name FROM CronTrigger WHERE CronJobDetail.Name LIKE 'ChangeAlert_%'];
    
            for (CronTrigger ct : jobsToResume) {
                System.resumeJobById(ct.Id);
            }
    
            String status = [SELECT State FROM CronTrigger WHERE CronJobDetail.Name LIKE 'ChangeAlert_%'][0].State;
            if (status == 'WAITING') {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}