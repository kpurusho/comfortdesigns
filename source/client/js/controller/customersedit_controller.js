App.CustomersEditController = Ember.ObjectController.extend({

    cMeasurement: null,

    isNewMeasurement: false,

    editableMeasurement: function () {
        return this.get('cMeasurement');
    }.property('cMeasurement'),

    isMeasurementSelected: function () {
        return this.get('editableMeasurement') != null;
    }.property('editableMeasurement'),

    actions: {
        updateCustomer: function () {
            var customer = this.get('model');

            var that = this;
            var onSuccess = function () {
                console.log('customer saved successfully..');
                that.transitionToRoute('customers');
            };

            var onFailure = function (error) {
                window.alert('Failed to save..');
                console.log(error.message);
            }
            customer.save().then(onSuccess, onFailure);
        },
        editMeasurement: function (measurement) {
            this.set('editableMeasurement', measurement);
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
            this.set('editableMeasurement', measurement);
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

            this.set('editableMeasurement', null);
            this.set('isNewMeasurement', false);
        },
        cancelMeasurement: function (measurement) {
            var isNew = this.get('isNewMeasurement');
            if (isNew) {
                measurement.deleteRecord();
                measurement.get('isDeleted');
            }
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

