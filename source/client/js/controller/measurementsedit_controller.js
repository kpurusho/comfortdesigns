App.MeasurementsEditController = Ember.ObjectController.extend({

	actions: {
		updateItem: function () {
			var measurement = this.get('model');
			measurement.save();
			var customer = this.get('customer');
			this.transitionToRoute('customers.edit', customer);
		}
	},

	isNew: function () {
		console.log("calculating isNew");
		return this.get('model').get('id');
	}.property() //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property
});

