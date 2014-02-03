App.CustomersEditController = Ember.ObjectController.extend({

    removedMeasurements: [],

    actions: {
        updateCustomer: function () {
            var customer = this.get('model');

            var self = this;
            var onCustomerSaveFailure = function (error) {
                window.alert('Failed to save customer..');
                console.log(error.message);
            }

            var onCustomerSaveSuccess = function () {
                console.log('customer saved successfully..');
                self.transitionToRoute('customers');
            }

            var onMeasurementsSaveSuccess = function () {
                console.log('all measurements saved successfully..');
            };

            var onMeasurementsSaveFailure = function () {
                window.alert('Failed to save measurements..');
                console.log(error.message);
            };

            customer.get('measurements').then(function (measurements) {
                measurements.save().then(onMeasurementsSaveSuccess, onMeasurementsSaveFailure).then(function () {
                    self.get('removedMeasurements').forEach(function (measurement) {
                        measurement.save();
                    });
                }).then(function () {
                    customer.save().then(onCustomerSaveSuccess, onCustomerSaveFailure);
                });
            });
        },
        cancelCustomer: function () {
            var customer = this.get('model');

            customer.get('measurements').then(function (measurements) {
                measurements.forEach(function (measurement) {
                    if (measurement.get('isNew')) {
                        customer.get('measurements').removeObject(measurement);
                        measurement.deleteRecord();
                    }
                    else {
                        measurement.rollback();
                    }
                });
            });

            if (customer.get('isNew')) {
                customer.deleteRecord();
            }
            else {
                customer.rollback();
            }

            this.transitionToRoute('customers');
        },
        editMeasurement: function (measurement) {
            var customer = this.get('model');
            var editableMeasurement = this.store.createRecord('measurement', measurement.toJSON());

            this.send('openModal', 'measurement', editableMeasurement, measurement, customer, false);
        },
        removeMeasurement: function (measurement) {
            var customer = this.get('model');

            customer.get('measurements').removeObject(measurement);

            var isRecordNew = measurement.get('isNew');

            measurement.deleteRecord();

            if (isRecordNew) {
                console.log('deleting new record');
            }
            else {
                console.log('deleting saved record');
                this.get('removedMeasurements').push(measurement);
            }
        },
        createMeasurement: function () {
            var measurement = this.store.createRecord('measurement', { name: this.get('name') });
            var customer = this.get('model');
            this.send('openModal', 'measurement', measurement, null, customer, true);
        }
    },

  isNew: function() {
      console.log("calculating isNew");
      var id = this.get('content').get('id');
      return id;
  }.property(), //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property
});

