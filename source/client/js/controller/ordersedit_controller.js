App.OrdersEditController = Ember.ObjectController.extend({

    states: [App.Consts.OrderState.New, App.Consts.OrderState.InProgress, App.Consts.OrderState.Done, App.Consts.OrderState.Delivered],

    measurementtypes : [App.Consts.MeasurementType.Blouse, App.Consts.MeasurementType.Chudidhar],

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
        updateOrder: function () {
            var order = this.get('model');

            var self = this;

            var onOrderSaveSuccess = function () {
                console.log('order saved successfully..');

                var order = self.get('model');
                self.store.find('customer', { phoneno: self.get('customerphoneno') }).then(function (customers) {
                    if (customers.get('length') > 0) {//TODO: handle multiple customer record
                        var customer = customers.objectAt(0);

                        var customerMeasurements = [];
                        var orderMeasurements = [];
                        var saveMeasurements = new Array();
                        customer.get('measurements').then(function (measurements) {
                            measurements.forEach(function (measurement) {
                                customerMeasurements.push(measurement);
                            });
                        }).then(function () {
                            order.get('measurements').then(function (measurements) {
                                measurements.forEach(function (measurement) {
                                    orderMeasurements.push(measurement);
                                });
                            });
                        }).then(function () {
                            orderMeasurements.forEach(function (oMeasurement) {
                                var matchFound = false;
                                customerMeasurements.forEach(function (cMeasurement) {
                                    if (cMeasurement.get('name') === oMeasurement.get('name') &&
                                        cMeasurement.get('type') === oMeasurement.get('type')) {
                                        cMeasurement.setProperties(oMeasurement.toJSON());
                                        saveMeasurements.push(cMeasurement.save());
                                        matchFound = true;
                                    }
                                });
                                if (!matchFound) {
                                    var newMeasurement = self.store.createRecord('measurement', oMeasurement.toJSON());
                                    saveMeasurements.push(newMeasurement.save());
                                    customer.get('measurements').pushObject(newMeasurement);
                                }
                            });
                            Ember.RSVP.all(saveMeasurements).then(function () {
                                customer.save();
                            });
                        });
                    }
                    else {
                        var customer = self.store.createRecord('customer', { name: self.get('customername'), phoneno: self.get('customerphoneno'), emailid: self.get('customeremailid') });
                        var saveMeasurements = new Array();
                        var newMeasurements = [];
                        order.get('measurements').then(function (measurements) {
                            measurements.forEach(function (measurement) {
                                var cMeasurement = self.store.createRecord('measurement', measurement.toJSON());
                                newMeasurements.push(cMeasurement);
                                saveMeasurements.push(cMeasurement.save());
                            });
                        }).then(function () {
                            Ember.RSVP.all(saveMeasurements).then(function () {
                                customer.get('measurements').then(function (measurements) {
                                    newMeasurements.forEach(function (measurement) {
                                        measurements.pushObject(measurement);
                                    });
                                    customer.save();
                                });
                            });
                        });

                    }
                });

                self.transitionToRoute('orders');
            };

            var onOrderSaveFailure = function (error) {
                window.alert('Failed to save order..');
                console.log(error.message);
            }

            var onMeasurementsSaveSuccess = function () {
                console.log('all measurements saved successfully..');
            };

            var onMeasurementsSaveFailure = function () {
                window.alert('Failed to save measurements..');
                console.log(error.message);
            };

            order.get('measurements').then(function(measurements) {
                measurements.save().then(onMeasurementsSaveSuccess, onMeasurementsSaveFailure).then(function () {
                    self.get('removedMeasurements').forEach(function (measurement) {
                        measurement.save();
                    });
                }).then(function () {
                    order.save().then(onOrderSaveSuccess, onOrderSaveFailure);
                });
            });
        },
        cancelOrder: function () {
            var order = this.get('model');

            order.get('measurements').then(function (measurements) {
                measurements.forEach(function (measurement) {
                    if (measurement.get('isNew')) {
                        order.get('measurements').removeObject(measurement);
                        measurement.deleteRecord();
                    }
                    else {
                        measurement.rollback();
                    }
                });
            });

            if (order.get('isNew')) {
                order.deleteRecord();
            }
            else {
                order.rollback();
            }

            this.transitionToRoute('orders');
        },
        editMeasurement: function (measurement) {
            var editableMeasurement = this.store.createRecord('measurement', measurement.toJSON());

            this.set('currentMeasurement', measurement);
            this.set('editableMeasurement', editableMeasurement);
            this.set('isNewMeasurement', false);
        },
        removeMeasurement: function (measurement) {
            var order = this.get('model');

            order.get('measurements').removeObject(measurement);

            var isRecordNew = measurement.get('isNew');

            measurement.deleteRecord();
            //measurement.get('isDeleted');

            if (isRecordNew) {
                console.log('deleting new record');
            }
            else {
                console.log('deleting saved record');
                this.get('removedMeasurements').push(measurement);
            }
        },
        createMeasurement: function () {
            if (this.get('isNewMeasurement')) return;

            var measurement = this.store.createRecord('measurement', { name: this.get('customername')});
            this.set('editableMeasurement', measurement);
            this.set('isNewMeasurement', true);
        },
        getMeasurement: function () {
            var order = this.get('model');
            var self = this;
            this.store.find('customer', { phoneno: this.get('customerphoneno') }).then(function (customers) {
                if (customers.get('length') > 0) {//TODO: handle multiple customer record
                    var customer = customers.objectAt(0);

                    customer.get('measurements').then(function(measurements) {
                        measurements.forEach(function (measurement) {
                            var newMeasurement = self.store.createRecord('measurement', measurement.toJSON());
                            order.get('measurements').pushObject(newMeasurement);
                        });
                    });
                }
            });
        },
        updateMeasurement: function (measurement) {
            var order = this.get('model');
            var isNew = this.get('isNewMeasurement');
            if (isNew) {
                order.get('measurements').pushObject(measurement);
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

