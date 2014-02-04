App.OrdersEditController = Ember.ObjectController.extend({

    states: [App.Consts.OrderState.New, App.Consts.OrderState.InProgress, App.Consts.OrderState.Done, App.Consts.OrderState.Delivered],

    removedMeasurements: [],

    ordersummary: function () {
        return this.store.find('ordersummary');
    }.property(),

    actions: {
        updateCustomerDetails: function (phno) {
            var self = this;
            var phno = this.get('customerphoneno');
            if (!phno) return;

            this.store.find('customer', { phoneno: phno }).then(function (customers) {
                if (customers.get('length') > 0) {//TODO: handle multiple customer record
                    var customer = customers.objectAt(0);
                    self.set('customername', customer.get('name'));
                    self.set('customeremailid', customer.get('emailid'));
                }
            });
        },

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
                            for(oIdx = 0; oIdx < orderMeasurements.length; oIdx++) {
                                var oMeasurement = orderMeasurements[oIdx];

                                var matchFound = false;
                                for(cIdx = 0; cIdx < customerMeasurements.length; cIdx++) {
                                    cMeasurement = customerMeasurements[cIdx];

                                    if (cMeasurement.get('name') === oMeasurement.get('name') &&
                                        cMeasurement.get('type') === oMeasurement.get('type')) {
                                        cMeasurement.setProperties(oMeasurement.toJSON());
                                        saveMeasurements.push(cMeasurement.save());
                                        matchFound = true;
                                    }
                                }

                                if (!matchFound) {
                                    var newMeasurement = self.store.createRecord('measurement', oMeasurement.toJSON());
                                    saveMeasurements.push(newMeasurement.save());
                                    customer.get('measurements').pushObject(newMeasurement);
                                }
                            }
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
            var order = this.get('model');
            var editableMeasurement = this.store.createRecord('measurement', measurement.toJSON());

            this.send('openModal', 'measurement', editableMeasurement, measurement, order, false);
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
            var measurement = this.store.createRecord('measurement', { name: this.get('name') });
            var order = this.get('model');
            this.send('openModal', 'measurement', measurement, null, order, true);
        },
        getMeasurement: function () {
            var customerphno = this.get('customerphoneno');

            if (!customerphno) {
                window.alert('Enter customer phone numbers to get measurements');
                return;
            }

            var order = this.get('model');
            var self = this;

            this.store.find('customer', { phoneno: customerphno }).then(function (customers) {
                if (customers.get('length') > 0) {//TODO: handle multiple customer record
                    var customer = customers.objectAt(0);

                    customer.get('measurements').then(function (measurements) {
                        measurements.forEach(function (measurement) {
                            var newMeasurement = self.store.createRecord('measurement', measurement.toJSON());
                            order.get('measurements').pushObject(newMeasurement);
                        });
                    });
                } else {
                    window.alert('No measurements found for customer with phone no ' + customerphno);
                }
            });
        },
    },

  isNew: function() {
      console.log("calculating isNew");
      var id = this.get('content').get('id');
      return id;
  }.property(), //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property
});

