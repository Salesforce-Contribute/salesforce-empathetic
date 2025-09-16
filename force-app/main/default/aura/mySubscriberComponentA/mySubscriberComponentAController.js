({
    
    
    doInit: function(cmp, event, helper) {
        // Read the message argument to get the values in the message payload
         if (event != null && event.getParam("recordId") != null) {
            let params = event.getParams();
            cmp.set("v.recordValue", JSON.stringify(params, null, "\t"));
        }
    },
    
    

    subscribeMessageChannel: function(cmp, event, helper) {
        console.log('-----subscribeMessageChannel------');
        //const messageService = cmp.find("messageChannel")
       	//console.log('MessageChannel: '+ messageService);
        //subscription = sforce.one.subscribe(messageChannel, -1, function(message) {
            // Your message handling logic here
      	//});
      	const messageService = component.find("messageService");
        const subscription =messageService.subscribe("messageChannel", function(message) {
            console.log("Received message: ", message);
        });
        component.set("v.subscription", subscription);
    },
    
    /*subscribeMessageChannel: function(cmp, event, helper) {
        console.log('subscription------')
        var attributeValue = cmp.get("v.subscription");
        console.log("current text: " + attributeValue);
        
        let subscribtion = sforce.one.subscribe(contextMessage, handleMessage);
        console.log('subscribtion:'+ subscribtion);

        if (!subscription) {
            subscription = sforce.one.subscribe(contextMessage, (event) {
                 if (event != null && event.getParam("recordId") != null) {
                    let params = event.getParams();
                    cmp.set("v.recordValue", JSON.stringify(params, null, "\t"));
                }
            });
        }
    },*/
    
    unSubscribeMessageChannel: function(component) {
        //let messageChannel = cmp.find("messageChannel");
            //sforce.one.unsubscribe(messageChannel);
        const subscription = component.get("v.subscription");
        if (subscription) {
            component.find("messageService").unsubscribe(subscription);
        }
        
    },
    
    /*unSubscribeMessageChannel: function(cmp, event. helper) {
    	var subscription = cmp.get('subscription');
        if (subscription) {
        	sforce.one.unsubscribe(subscription);
            subscription = null;
        }
   },*/
})