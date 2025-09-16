({
    doInit:function(component, event, helper) {
    	var action = component.get('c.getContacts');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                console.log('success');
                component.set('v.contactList', response.getReturnValue());
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    
    },
    
    publicMessageService: function (component, event) {
        var payload = { recordId:  event.target.dataset.contactId };
        // Publish LMS message with payload
        console.log('Aura payload: '+ JSON.stringify(payload));
        const messageChannel = component.find("messageChannel");
        console.log(messageChannel);
        component.find('messageChannel').publish(payload);
    }
})