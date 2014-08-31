App.CustomersEditController = Ember.ObjectController.extend(Ember.Validations.Mixin, {

    removedMeasurements: [],

    actions: {
        updateCustomer: function () {
            var customer = this.get('model');

            var self = this;
            var onCustomerSaveFailure = function (error) {
                window.alert('Failed to save customer..');
                console.log(error.message);
            };

            var onCustomerSaveSuccess = function () {
                console.log('customer saved successfully..');
                self.transitionToRoute('customers');
            };

            var onMeasurementsSaveSuccess = function () {
                console.log('all measurements saved successfully..');
            };

            var onMeasurementsSaveFailure = function () {
                window.alert('Failed to save measurements..');
                console.log(error.message);
            };

            customer.get('measurements').then(function (measurements) {
                var marr = measurements.toArray();
                async.forEach(marr,
                    function(measurement, done) {
                        App.Measurementhelper.saveMeasurement(measurement, done);
                    },
                    function done() {
                        console.log('measurements saved successfully..');
                        console.log('Trying to save customer..');
                        customer.save().then(onCustomerSaveSuccess, onCustomerSaveFailure);
                    }
                );
            });
        },

        cancelCustomer: function () {
            var customer = this.get('model');
            var self = this;

            App.OrderCustomerCommonHelper.cancel(customer, function(){
                self.transitionToRoute('customers');
            });
        },

        editMeasurement: function (measurement) {
            var customer = this.get('model');
            var self = this;

            App.Measurementhelper.cloneMeasurement(measurement, self.store, function (editableMeasurement){
                self.send('openModal', 'measurement', editableMeasurement, measurement, customer, false);
            });
        },

        removeMeasurement: function (measurement) {
            var customer = this.get('model');

            customer.get('measurements').removeObject(measurement);

            var isRecordNew = measurement.get('isNew');

            App.Measurementhelper.deleteMeasurement(measurement, false);

            if (!isRecordNew) {
                this.get('removedMeasurements').push(measurement);
            }
        },

        createMeasurement: function () {
            var self = this;
            var customer = this.get('model');
            var measurement = self.store.createRecord('measurement');
            measurement.set('type', '');
            measurement.set('name', self.get('name') );
            self.send('openModal', 'measurement', measurement, null, customer, true);
        }
    },

  isNew: function() {
      console.log("calculating isNew");
      var id = this.get('content').get('id');
      return id;
  }.property() //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property
});


App.CustomersEditController.reopen({
    validations: {
        name: {
            presence: true
        },
        phoneno: {
            presence: true,
            numericality: true
        }
    }
});