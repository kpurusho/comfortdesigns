App.CustomersEditController = Ember.ObjectController.extend({

    measurementtypes: [App.Consts.MeasurementType.Blouse, App.Consts.MeasurementType.Chudidhar],

    eMeasurement: null,

    currentMeasurement: null,

    removedMeasurements: [],

    isNewMeasurement: false,

    editableMeasurement: function () {
        return this.get('eMeasurement');
    }.property('eMeasurement'),

    isMeasurementSelected: function () {
        return this.get('editableMeasurement') != null;
    }.property('editableMeasurement'),

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
            var editableMeasurement = this.store.createRecord('measurement', measurement.toJSON());

            this.set('currentMeasurement', measurement);
            this.set('editableMeasurement', editableMeasurement);
            this.set('isNewMeasurement', false);
        },
        removeMeasurement: function (measurement) {
            measurement.deleteRecord();
            measurement.get('isDeleted');
            measurement.save();
        },
        createMeasurement: function () {
            if (this.get('isNewMeasurement')) return;

            var measurement = this.store.createRecord('measurement', { name: this.get('name') });
            this.set('editableMeasurement', measurement);
            this.set('isNewMeasurement', true);
        },
        updateMeasurement: function (measurement) {
            var customer = this.get('model');
            var isNew = this.get('isNewMeasurement');
            if (isNew) {
                customer.get('measurements').pushObject(measurement);
            }
            else {
                this.get('currentMeasurement').setProperties(measurement.toJSON());
                measurement.deleteRecord();
            }
            this.set('currentMeasurement', null);
            this.set('editableMeasurement', null);
            this.set('isNewMeasurement', false);
        },
        cancelMeasurement: function (measurement) {
            measurement.deleteRecord();
            this.set('currentMeasurement', null);
            this.set('editableMeasurement', null);
            this.set('isNewMeasurement', false);
        }
    },

  isNew: function() {
      console.log("calculating isNew");
      var id = this.get('content').get('id');
      return id;
  }.property(), //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property
});

