public with sharing class TodoController {
    public TodoController() {

    }

    @AuraEnabled
    public static string getTaskData(){
        try {
            List<Sring> data = new List<String>{
                "statusCode": 200,
                "result": [
                  {
                    "workByDateTime": "",
                    "status": "Appointment Scheduled",
                    "state": "Complete",
                    "processTaskId": "a0MHF000000ATWz2AO",
                    "processQueueId": "a0LHF000003lqsf2AA",
                    "description": "Receive patient intake form",
                    "completeByDateTime": "2025-02-20T12:00:00.000Z",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Request",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATX02AO",
                    "processQueueId": "a0LHF000003lqsf2AA",
                    "description": "Verify insurance details",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Document Collection",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATX12AO",
                    "processQueueId": "a0LHF000003lqsf2AA",
                    "description": "Request medical history",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Document Collection",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATX22AO",
                    "processQueueId": "a0LHF000003lqsf2AA",
                    "description": "Upload insurance card",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Physician Review",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATX32AO",
                    "processQueueId": "a0LHF000003lqsf2AA",
                    "description": "Assign physician for initial review",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Transfer Request",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATX42AO",
                    "processQueueId": "a0LHF000003lqsg2AA",
                    "description": "Receive transfer request",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Transfer Request",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATX52AO",
                    "processQueueId": "a0LHF000003lqsg2AA",
                    "description": "Confirm patient condition",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Approval Pending",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATX62AO",
                    "processQueueId": "a0LHF000003lqsg2AA",
                    "description": "Obtain hospital administrator approval",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Transportation Scheduled",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATX72AO",
                    "processQueueId": "a0LHF000003lqsg2AA",
                    "description": "Arrange ambulance or medical transport",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Transportation Scheduled",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATX82AO",
                    "processQueueId": "a0LHF000003lqsg2AA",
                    "description": "Notify receiving hospital",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Claim",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATX92AO",
                    "processQueueId": "a0LHF000003lqsh2AA",
                    "description": "Submit insurance claim",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Pending Documentation",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXA2A4",
                    "processQueueId": "a0LHF000003lqsh2AA",
                    "description": "Request missing patient documents",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Insurance Review",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXB2A4",
                    "processQueueId": "a0LHF000003lqsh2AA",
                    "description": "Adjust claim amount based on policy",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Application",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXC2A4",
                    "processQueueId": "a0LHF000003lqsi2AA",
                    "description": "Receive loan application",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Application",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXD2A4",
                    "processQueueId": "a0LHF000003lqsi2AA",
                    "description": "Assign loan officer",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Document Review",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXE2A4",
                    "processQueueId": "a0LHF000003lqsi2AA",
                    "description": "Collect W-2 forms and tax returns",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Document Review",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXF2A4",
                    "processQueueId": "a0LHF000003lqsi2AA",
                    "description": "Verify employment status",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Credit Check",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXG2A4",
                    "processQueueId": "a0LHF000003lqsi2AA",
                    "description": "Pull credit report",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Credit Check",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXH2A4",
                    "processQueueId": "a0LHF000003lqsi2AA",
                    "description": "Assess debt-to-income ratio",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Audit Request",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXI2A4",
                    "processQueueId": "a0LHF000003lqsj2AA",
                    "description": "Assign auditor",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Audit Request",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXJ2A4",
                    "processQueueId": "a0LHF000003lqsj2AA",
                    "description": "Request tax documents",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Review in Progress",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXK2A4",
                    "processQueueId": "a0LHF000003lqsj2AA",
                    "description": "Identify potential discrepancies",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Review in Progress",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXL2A4",
                    "processQueueId": "a0LHF000003lqsj2AA",
                    "description": "Cross-check with financial records",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Issues Identified",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXM2A4",
                    "processQueueId": "a0LHF000003lqsj2AA",
                    "description": "Notify client of required corrections",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Issues Identified",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXN2A4",
                    "processQueueId": "a0LHF000003lqsj2AA",
                    "description": "Prepare compliance report",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Investment Request",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXO2A4",
                    "processQueueId": "a0LHF000003lqsk2AA",
                    "description": "Receive client investment request",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Risk Analysis",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXP2A4",
                    "processQueueId": "a0LHF000003lqsk2AA",
                    "description": "Assess risk tolerance",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Compliance Review",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXQ2A4",
                    "processQueueId": "a0LHF000003lqsk2AA",
                    "description": "Ensure SEC compliance",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Compliance Review",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXR2A4",
                    "processQueueId": "a0LHF000003lqsk2AA",
                    "description": "Review tax implications",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Portfolio Adjustment",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXS2A4",
                    "processQueueId": "a0LHF000003lqsk2AA",
                    "description": "Reallocate funds",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Contract Received",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXT2A4",
                    "processQueueId": "a0LHF000003lqsl2AA",
                    "description": "Upload contract document",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Contract Received",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXU2A4",
                    "processQueueId": "a0LHF000003lqsl2AA",
                    "description": "Assign legal counsel",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Initial Review",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXV2A4",
                    "processQueueId": "a0LHF000003lqsl2AA",
                    "description": "Identify key legal clauses",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Client Approval",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXW2A4",
                    "processQueueId": "a0LHF000003lqsl2AA",
                    "description": "Send contract for client review",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Client Approval",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXX2A4",
                    "processQueueId": "a0LHF000003lqsl2AA",
                    "description": "Receive client signature",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Case Intake",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXY2A4",
                    "processQueueId": "a0LHF000003lqsm2AA",
                    "description": "Assign attorney",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "New Case Intake",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXZ2A4",
                    "processQueueId": "a0LHF000003lqsm2AA",
                    "description": "Review case details",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Discovery Process",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXa2AO",
                    "processQueueId": "a0LHF000003lqsm2AA",
                    "description": "Gather evidence",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Discovery Process",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXb2AO",
                    "processQueueId": "a0LHF000003lqsm2AA",
                    "description": "Conduct depositions",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Court Filings",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXc2AO",
                    "processQueueId": "a0LHF000003lqsm2AA",
                    "description": "File legal motions",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Court Filings",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXd2AO",
                    "processQueueId": "a0LHF000003lqsm2AA",
                    "description": "Prepare court documents",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Backlog",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXe2AO",
                    "processQueueId": "a0LHF000003lqsn2AA",
                    "description": "Define user stories",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Backlog",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXf2AO",
                    "processQueueId": "a0LHF000003lqsn2AA",
                    "description": "Prioritize feature requests",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "In Progress",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXg2AO",
                    "processQueueId": "a0LHF000003lqsn2AA",
                    "description": "Write API endpoint",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "In Progress",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXh2AO",
                    "processQueueId": "a0LHF000003lqsn2AA",
                    "description": "Develop frontend UI",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Code Review",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXi2AO",
                    "processQueueId": "a0LHF000003lqsn2AA",
                    "description": "Conduct peer review",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Testing",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXj2AO",
                    "processQueueId": "a0LHF000003lqsn2AA",
                    "description": "Execute unit tests",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Testing",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXk2AO",
                    "processQueueId": "a0LHF000003lqsn2AA",
                    "description": "Conduct user acceptance testing",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Risk Assessment",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXl2AO",
                    "processQueueId": "a0LHF000003lqso2AA",
                    "description": "Identify security vulnerabilities",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Identify Vulnerabilities",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXm2AO",
                    "processQueueId": "a0LHF000003lqso2AA",
                    "description": "Run automated security scan",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Patching & Fixes",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXn2AO",
                    "processQueueId": "a0LHF000003lqso2AA",
                    "description": "Apply security patches",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "",
                    "status": "Patching & Fixes",
                    "state": "Undefined",
                    "processTaskId": "a0MHF000000ATXo2AO",
                    "processQueueId": "a0LHF000003lqso2AA",
                    "description": "Update firewall rules",
                    "completeByDateTime": "",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "2025-03-03T14:05:22.000Z",
                    "status": "Physician Review",
                    "state": "Working",
                    "processTaskId": "a0MHF000000AgSc2AK",
                    "processQueueId": "a0LHF000003lqsf2AA",
                    "description": "Test Physician Review",
                    "completeByDateTime": "2025-03-06T14:05:22.000Z",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "2025-03-03T13:19:31.000Z",
                    "status": "New",
                    "state": "Waiting",
                    "processTaskId": "a0MHF000000Agaf2AC",
                    "processQueueId": "a0LHF000003lqsf2AA",
                    "description": "Test",
                    "completeByDateTime": "2025-03-06T13:19:31.000Z",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "2025-03-03T13:22:48.000Z",
                    "status": "New",
                    "state": "Waiting",
                    "processTaskId": "a0MHF000000AgcH2AS",
                    "processQueueId": "a0LHF000003lqsf2AA",
                    "description": "Test",
                    "completeByDateTime": "2025-03-06T13:22:48.000Z",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "2025-03-03T13:49:59.000Z",
                    "status": "New",
                    "state": "Waiting",
                    "processTaskId": "a0MHF000000Agdt2AC",
                    "processQueueId": "a0LHF000003lqsf2AA",
                    "description": "test",
                    "completeByDateTime": "2025-03-06T13:49:59.000Z",
                    "assignedToId": "a0JHF000001uWO12AM"
                  },
                  {
                    "workByDateTime": "2025-03-03T14:05:52.000Z",
                    "status": "Appointment Scheduled",
                    "state": "Complete",
                    "processTaskId": "a0MHF000000AgfV2AS",
                    "processQueueId": "a0LHF000003lqsf2AA",
                    "description": "Test Appointment Scheduled",
                    "completeByDateTime": "2025-03-06T14:05:52.000Z",
                    "assignedToId": "a0JHF000001uWO12AM"
                  }
                ],
                "numberOfResults": 57
              }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}