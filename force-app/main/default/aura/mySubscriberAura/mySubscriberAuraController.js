({
    handleChanged: function(component, event, helper) {
        // Read the message argument to get the values in the message payload
         if (event != null && event.getParam("recordId") != null) {
            let params = event.getParams();
            component.set("v.recordValue", JSON.stringify(params, null, "\t"));
        }
    },
})