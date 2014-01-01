App.CustomersEditController = Ember.ObjectController.extend({

    actions: {
        updateItem: function () {
            //var measurement = App.Measurement.createRecord('measurement', {
            //    type: 'sk',
            //    name: 'main',
            //    customer: cust
            //});
            //cust.get('measurements').pushObject(measurement);
            //cust.transaction.commit();
            //this.get("target").transitionTo("customers");

            var customer = this.get('model');
            customer.save();
            this.transitionToRoute('customers');
        }
    },

  isNew: function() {
      console.log("calculating isNew");
      var id = this.get('content').get('id');
      return id;
  }.property(), //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property

  measurementsPresent: function () {
      var model = this.get('model');
      var measurements = this.get('measurements');
      console.log(measurements.constructor);
      var itemsPresent = measurements.length;
      console.log(" +++ Computed measurementPresent prop with value " + itemsPresent);
      return itemsPresent;
  }.property("content.@each")


});

