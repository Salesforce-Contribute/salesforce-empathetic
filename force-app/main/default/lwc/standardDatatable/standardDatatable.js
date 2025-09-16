import { LightningElement } from 'lwc';
import { NavigationMixin } from "lightning/navigation";

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Name', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'Close At', fieldName: 'closeAt', type: 'date', typeAttributes:{day:'numeric',month:'short',year:'numeric', hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}},
    { label: 'Login', fieldName: 'loginSandbox', type: 'url', typeAttributes:{label:'Login sandbox'}},
    { label: 'Link', fieldName: 'urlValuefield', type: 'url', typeAttributes:{label: {fieldName: 'labelforurlValuefield'}}},
    // { label: 'Create Account', fieldName: '', type: 'url',  typeAttributes:{ }},
    { label: 'Is Active?', fieldName: 'Is_Active__c', type: 'boolean' },
    {type: 'action', typeAttributes: { rowActions: actions }},
];

export default class StandardDatatable extends NavigationMixin(LightningElement) {

    data = [];
    columns = columns;
    record = {};

    connectedCallback() {
        this.data = this.generateData({ amountOfRecords: 100 });
        console.log(this.data);
    }

    handleRowAction(event) {
        console.log('standardDatatale: => '+ event.detail.selectedRows);
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        console.log(JSON.stringify(row)+'=> '+JSON.stringify(actionName));

        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'link':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    deleteRow(row) {
        const { id } = row;
        const index = this.findRowIndexById(id);
        if (index !== -1) {
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    showRowDetails(row) {
        this.record = row;
    }

    generateData({ amountOfRecords }) {
        return [...Array(amountOfRecords)].map((_, index) => {
            return {
                name: `Name (${index})`,
                website: 'www.salesforce.com',
                amount: Math.floor(Math.random() * 100),
                phone: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                closeAt: '2024-04-05T02:21:00.000+0000',
                /*closeAt: new Date(
                    Date.now() + 86400000 * Math.ceil(Math.random() * 20)
                )*/
                Is_Active__c:true,
                loginSandbox: 'test.salesforce.com',
                urlValuefield: 'https://www.google.com/'
            };
        });
    }
}


//generate org token 
//System.assert(false, UserInfo.getOrganizationId() + '' + UserInfo.getSessionId().subString(15));

//Advantage of async apex

/*
    Runs in background
    Higher governer limit
    Can be schedule
    Can process more number of records


    Aysnc apex method

    1 future method: 
        Futer method run its own transaction
        Future method execute when system resource are available
        This method must be static, we can't remove static keywork, this method have no return type. paramerter must be primitive data type(id, string, long, interger), or collection of primitive data type.
        It accept only primitive data type in parameter
        
        ->Reason why not accept non-primitive data type:
        And the reason why it doesn't accept non primitive data types is, like if you pass these lead records directly to this future method, by the time this future method executes in future, which Salesforce doesn't guarantee when this will execute, maybe these records will get updated. In that case, you will lose your database integrity because you will be updating a record which is already updated by someone else in the meantime. So, that's the reason you can only accept this primitive data types,

        YOu can't call one future method into another futur method, does not allow. As well as you can't call method of batch , schedule and queueable class in futur mehtod. but you can call multiple method from asynchronous window.



    2 Batch apex:
        Used for long - running process that run thoursands for records 
        It break the data into chunks
        Cab be schedule

        start method -> Executer once, return batch scope or records, rteurn upto 50 million records. 
        querLocator -  this query locator is nothing but the scope that you are getting in the start method. For example, let's say this simple query is giving me 50000 records, then these 50000 records will be supplied to this get query locator method, and then these records will be supplied to your execute method based on the batch size.

        executer mehtod: - this execute method executes separately for each batch of records. So, let's say if my batch scope is 50000 records and my batch size is 2000, that means this execute method will be executed 25 times, because in order to process all those 50000 records with the batch size as 2000, it will take 25 turns to complete all those 50000 records. This method cannot return any value, so it must have void return type, 
        
        each and every execution of this method will have separate set of governor limits. they apply to the one execution of this execute method.

        finish method: This finish method only executes once and it executes once all the records are processed or all the batches are processed. We use this finish method to do some post-processing, like maybe calling another batch class from it or sending an email about the batch completion.

        a batch class, you need to use execute batch method from database class. This execute batch method takes the batch class instance as the first parameter and this is the required parameter.The second parameter is an optional parameter which defines the batch size.

        default batch size 2000

        not provide chaining jobs


    3 Queueable apex: 
        Apex processes that run for a long time, such as extensive database operations or external web service callouts, 
        the Queueable Apex is essentially a superset of future methods and this queueable Apex can do some things that your future methods can not do, like it can handle the non-primitive data types, so here you can directly pass your s-object records inside the queueable Apex.

        Monitoring- retunr job id.
        Support non-primitive types
        Chainning jobs (which is not possible in future calss method)

        In return of this method, you get the job id, which you can use to track the progress of this job.

        Now, if you want to make a chain of queueable classes or if you want to call a queueable class, once the execution of current queueable class finishes, then you can do it from this execute method and here you can call another queueable class as well.

        benefit that we get with batch Apex or queueable Apex is, we get this id in our code itself and we can use this id to track the progress using the Apex code itself, which is not possible in case of future


    4 Schedule apex:
        
        Schedules Apex is super powerful tool to make your Apex code run at specific times or to run it periodically
        you can run any type of Apex code within Scheduled Apex.

        it can be your synchronous code that you have written or it can be any other async code as well, like maybe your batch Apex or your queueable Apex or maybe your future methods as well.

        This execute method takes a schedulable context as parameter which is used by the Apex internally.

        So, you won't be using this schedulable context variable in your code.

    In order to call this scheduled Apex, you need to use the schedule method from system class and this method takes three parameters.
    The first parameter is the job name, so you can give it any name.
    The second parameter is something called cron expression and we are going to talk about this in detail in our coming slide. 
    The third parameter is the instance of your Scheduled Apex class.

return, this method gives you the job id which you can use to track the progress of this job.

This cron expression decides when your code should be called.

========================================================DATA SECURITY =====================================
Access is many layered 
1 Org - IP range and login
2 Object - Permission sets, Permission set groups, Profile
3 Record - Org wide default, Role hierarchy, Sharing rules
4 Field - Field leve security

Org wide - THis determince that what access and persmission user have to records they don't have.

Public read/wirte/transfer - allow non-owner to view , edit and change ownership.

Role: A role hierarchy works together with sharing settings to determine the levels of access users have to your Salesforce data. Users can access the data of all the users directly below them in the hierarchy.
A  roles can control the level of visibility that users have into your Salesforce data. Users at any given role level can view, edit, and report on all data owned by or shared with users below them in the role hierarchy

if the Grant Access Using Hierarchies option is disabled for a custom object, only the record owner and users granted access by the org-wide defaults receive access to the object's records.

By default, the Grant Access Using Hierarchies option is enabled for all objects. It can only be changed for custom objects.

Deselect Grant Access Using Hierarchies if you want to prevent users from gaining automatic access to data owned by or shared with their subordinates in the hierarchies.

Role hierarchy best practice:
    1 Set up roles based on the access needs
    2 Don't create empty roles
    3 Remove inactive users from roles.

Can we create own custom role to assign user

Sharing settings:

Sharing rules: 
Read-Only or Read/Write access.

Sharing rules work best when they're defined for a particular group of users that you can determine or predict in advance, rather than a set of users that frequently changes.


Devices that connect to the internet, such as computers and phones, have varying levels of security controls. We suggest using a virtual private network (VPN) to make your internet connection more secure. 

Let’s review the purposes of profiles, permission sets, and permission set groups.

    Profiles: This provide default settings for each user, such as default record type, IP range, and so on. Salesforce recommends using the Minimum Access - Salesforce profile as a best practice for assignment to users. Each user has only one profile. 

    Permission Sets: This are collections of settings and permissions. Profiles allow users to perform some tasks, but permission sets allow additional tasks (tasks not enabled by profiles). For example, you can add permissions to create and customize list views, activate contracts, or any number of other permissions. 

    Permission Set Groups: This bundle permission sets together. Users assigned to a permission set group receive the combined permissions of all the permission sets in the group. Permission set groups correspond to the job functions of users. 

    Salesforce identity 
    Salesforce Identity lets you give the right people the right access to the right resources at the right time. You control who can access your orgs and who can use apps running on the Salesforce Platform, on-premises, in other clouds, and on mobile devices.

    -> Check out this list of the main features of Salesforce Identity.
        Single sign-on
        Connected apps
        Social sign-on
        Multi-factor authentication
        My Domain
        Centralized user account management
        User provisioning
        App Launcher

    -> With saring and without sharing:

        Use the with sharing or without sharing keywords on a class to specify whether sharing rules must be enforced.

        with sharing: Use the with sharing keyword when declaring a class to enforce sharing rules of the current user. Explicitly setting this keyword ensures that Apex code runs in the current user context. 

        without sharing: Use the without sharing keyword when declaring a class to ensure that the sharing rules for the current user are not enforced. 

        Implemention detials: 

        if a method is defined in a class declared as with sharing is called by a class declared as without sharing, the method executes with sharing rules enforced.

        If a class isn’t explicitly declared as either with sharing or without sharing, the current sharing rules remain in effect. Therefore, the class doesn’t enforce sharing rules except when it acquires sharing rules from another class. For example, if the class is called by another class that has sharing enforced, then sharing is enforced for the called class.

        Both inner classes and outer classes can be declared as with sharing. Inner classes do not inherit the sharing setting from their container class. Otherwise, the sharing setting applies to all code contained in the class, including initialization code, constructors, and methods.

        Classes inherit sharing setting from a parent class when one class extends another.

        if a method is defined in a class declared as with sharing is called by a class declared as without sharing, the method executes with sharing rules enforced.



    ===============================================================

    Lightning Web Components (LWC) is framework to build custom user interfaces, web and mobile apps, and digital experiences on the Salesforce Platform. Lightning web components are custom HTML elements built using HTML and JavaScript.
    Lightning Web Components uses core Web Components standards and provides only what’s necessary to perform well in browsers supported by Salesforce. Because it’s built on code that runs natively in browsers, Lightning Web Components is lightweight and delivers exceptional performance. Most of the code you write is standard JavaScript and HTML.

    You can build Lightning components using two programming models: Lightning Web Components, and the original model, Aura Components. Lightning web components and Aura components can coexist and interoperate on a page. To admins and end users, they both appear as Lightning components.
    Lightning Web Components is open source, empowering you to explore the source code, customize the behavior for your needs, and build enterprise-ready web components on any platform, not just Salesforce.

    Supported Salesforce Targets and Tools
    Lightning web components are supported for use with many Salesforce targets and tools. When you’re developing a component, specify its targets in the component’s configuration file.

    All see Lightning web components aren’t supported for use with these tools.To use a Lightning web component with these tools, wrap the component in an Aura component.

    LWC vs Aura

    Lightning web components inherit global HTML attributes and events, making them more functional and performant than their Aura counterparts.
    For component styling, the base Aura components and Lightning web components both support design variations and SLDS utility classes. 
    The base Aura components also support custom styling with your own classes. However, Lightning web components follow shadow DOM standards, which prevent custom styling with your own classes. Some base LWC components support SLDS styling hooks for custom styling. 
    Aura components follow the name format namespace:componentName, with a colon that separates the namespace and component name. Lightning web components follow the name format namespace-component-name, with a dash that separates the namespace and component name.

    What do your mean by native browser capabilities
    Native browser capabilities refer to the built-in features and functions that a web browser supports without needing any additional plugins or extensions. These capabilities are part of the browser's core functionality, enabling it to handle various tasks directly.

    How to Choose Lightning Web Components or Aura? 

    A Lightning web component can’t contain an Aura component.

    How to login component library org
    https://<myDomainName>.lightning.force.com/docs/component-library
    mydomain - empathetic-impala-7py9v6-dev-ed.trailblaze.lightning.force.com

    How to improve LWC performance 
    Go to the session setting and select "Enable secure and persistent browser caching to improve performance"

    System.LimitException: Apex heap size too large: 12044257



*/