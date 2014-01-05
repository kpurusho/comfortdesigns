App.CustomersEditController = Ember.ObjectController.extend({

    cMeasurement: null,

    isNewMeasurement: false,

    currentMeasurement: function () {
        return this.get('cMeasurement');
    }.property('cMeasurement'),

    isMeasurementSelected: function () {
        return this.get('currentMeasurement') != null;
    }.property('currentMeasurement'),

    actions: {
        updateCustomer: function () {
            var customer = this.get('model');

            var onSuccess = function () {
                console.log('customer saved successfully..');
            };

            var onFailure = function (error) {
                window.alert('Failed to save..');
                console.log(error.message);
            }
            customer.save().then(onSuccess, onFailure);
            this.transitionToRoute('customers');    //TODO; need to put this on success
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
            var customer = this.get('model');
            //var measurement = this.store.createRecord('measurement');
            var measurement = this.store.createRecord('measurement', { customer: customer });
            this.set('currentMeasurement', measurement);
            this.set('isNewMeasurement', true);
        },
        updateMeasurement: function (measurement) {
            var customer = this.get('model');
            var isNew = this.get('isNewMeasurement');

            var onSuccess = function () {
                if (isNew) {
                    customer.get('measurements').pushObject(measurement);
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

