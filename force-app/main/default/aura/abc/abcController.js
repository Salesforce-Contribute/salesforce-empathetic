({
	handleChange : function(component, event, helper) {
		var action = component.get('v.options');
        component.get('v.options', 'Lightning');
	}
})


({
	save : function(component, event, helper) {
		var action = component.get('v.options');
        console.log('Save:'+ action);
	}
})