App.CustomersEditController = Ember.ObjectController.extend({

    editCounter: function () {
        return this.filterProperty('selected', true).get('length');
    }.property('@each.selected'),

    itemsSelected: function () {
        return this.get("editCounter") > 0;
    }.property('editCounter'),

    newMeasurement: function () {
        var custid = this.get('id');
        var cust = this.store.find('customer', custid);
        var measurement = this.store.createRecord('measurement', { customer: cust });
        return measurement;
    }.property(),

    actions: {
        updateItem: function () {
            var customer = this.get('model');
            customer.save();
            this.transitionToRoute('customers');
        },
        removeMeasurement: function (measurement) {
            measurement.deleteRecord();
            measurement.get('isDeleted');
            measurement.save();
        },
        createMeasurement: function () {
            var custid = this.get('id');
            var cust = this.store.find('customer', custid);
            var measurement = this.store.createRecord('measurement', { customer: cust });
            this.transitionsToRoute('measurements.edit', cust, measurement);
        }
    },

  isNew: function() {
      console.log("calculating isNew");
      var id = this.get('content').get('id');
      return id;
  }.property(), //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property

  measurementsPresent: function () {
      var measurements = this.get('model.measurements');
      console.log(measurements.constructor);
      var itemsPresent = measurements.length;
      console.log(" +++ Computed measurementPresent prop with value " + itemsPresent);
      return itemsPresent;
  }.property("content.@each")


});

