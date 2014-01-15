App.OrdersEditController = Ember.ObjectController.extend({

    cMeasurement: null,

    isNewMeasurement: false,

    currentMeasurement: function () {
        return this.get('cMeasurement');
    }.property('cMeasurement'),

    isMeasurementSelected: function () {
        return this.get('currentMeasurement') != null;
    }.property('currentMeasurement'),

    actions: {
        updateOrder: function () {
            var order = this.get('model');

            var that = this;
            var onSuccess = function () {
                console.log('order saved successfully..');
                that.transitionToRoute('orders');
            };

            var onFailure = function (error) {
                window.alert('Failed to save..');
                console.log(error.message);
            }
            order.save().then(onSuccess, onFailure);
        },
        editMeasurement: function (measurement) {
            this.set('currentMeasurement', measurement);
            this.set('isNewMeasurement', false);
        },
        removeMeasurement: function (measurement) {
            measurement.deleteRecord();
            measurement.get('isDeleted');
            measurement.save();
        },
        createMeasurement: function () {
            if (this.get('isNewMeasurement')) return;

            var measurement = this.store.createRecord('measurement');
            this.set('currentMeasurement', measurement);
            this.set('isNewMeasurement', true);
        },
        getMeasurement: function () {
            //var customers = this.store.find('customer', { phoneno: this.get('customerphoneno') });
            var order = this.get('model');
            var self = this;
            this.store.find('customer', { phoneno: this.get('customerphoneno') }).then(function (customers) {
                if (customers.get('length') > 0) {
                    var customer = customers.objectAt(0);

                    customer.get('measurements').then(function(measurements) {
                        measurements.forEach(function (measurement) {
                            var newMeasurement = self.store.createRecord('measurement', measurement.toJSON());

                            var onSuccess = function () {
                                order.get('measurements').pushObject(newMeasurement);
                                console.log('successfully added measurement....');
                            };

                            var onFail = function (error) {
                                window.alert('Failed to save..');
                                console.log(error.message);
                            };

                            newMeasurement.save().then(onSuccess, onFail);
                        });
                    });
                }
            });
        },
        updateMeasurement: function (measurement) {
            var order = this.get('model');
            var isNew = this.get('isNewMeasurement');

            var onSuccess = function () {
                if (isNew) {
                    order.get('measurements').pushObject(measurement);
                }
                console.log('successfully added measurement....');
            };

            var onFail = function (error) {
                window.alert('Failed to save..');
                console.log(error.message);
            };

            measurement.save().then(onSuccess, onFail);

            this.set('currentMeasurement', null);
            this.set('isNewMeasurement', false);
        },
        cancelMeasurement: function (measurement) {
            var isNew = this.get('isNewMeasurement');
            if (isNew) {
                measurement.deleteRecord();
                measurement.get('isDeleted');
            }
            this.set('currentMeasurement', null);
            this.set('isNewMeasurement', false);
        }
    },

  isNew: function() {
      console.log("calculating isNew");
      var id = this.get('content').get('id');
      return id;
  }.property(), //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property
});

