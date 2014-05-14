App.OrdersEditController = Ember.ObjectController.extend(Ember.Validations.Mixin, {

    states: [App.Consts.OrderState.New, App.Consts.OrderState.InProgress, App.Consts.OrderState.Done, App.Consts.OrderState.Delivered],

    removedMeasurements: [],

    ordersummary: function () {
        //return this.store.find('ordersummary');
        var summary = App.OrdersummaryService.create();
        summary.set('store', this.store);
        summary.computesummary();
        return summary;
    }.property('model'),

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
                console.log('Order saved successfully');

                console.log('Trying to update customer..');

                var order = self.get('model');
                self.store.find('customer', { phoneno: self.get('customerphoneno') }).then(function (customers) {

                    var customer = null;
                    if (customers.get('length') > 0) {//TODO: handle multiple customer record
                        customer = customers.objectAt(0);
                    } else {
                        customer = self.store.createRecord('customer',
                            {
                                name: self.get('customername'),
                                phoneno: self.get('customerphoneno'),
                                emailid: self.get('customeremailid')
                            }
                        );
                    }

                    var customerMeasurements = [];
                    var orderMeasurements = [];
                    var saveMeasurements = new Array();
                    customer.get('measurements').then(function (measurements) {
                        customerMeasurements = measurements.toArray();
                    }).then(function () {
                        order.get('measurements').then(function (measurements) {
                            orderMeasurements = measurements.toArray();
                        }).then(function () {

                            async.forEach(orderMeasurements,

                                function(oMeasurement, done) {

                                    var matchFound = false;
                                    for (var cIdx = 0; cIdx < customerMeasurements.length; cIdx++) {
                                        var cMeasurement = customerMeasurements[cIdx];

                                        if (cMeasurement.get('name') === oMeasurement.get('name') &&
                                            cMeasurement.get('type') === oMeasurement.get('type')) {
                                            matchFound = true;
                                            App.Measurementhelper.copyMeasurement(oMeasurement, cMeasurement, self.store, function () {
                                                App.Measurementhelper.saveMeasurement(cMeasurement, done);
                                            });
                                            break;
                                        }
                                    }

                                    if (!matchFound) {
                                        App.Measurementhelper.cloneMeasurement(oMeasurement, self.store, function (newMeasurement) {
                                            App.Measurementhelper.saveMeasurement(newMeasurement, function() {
                                                customer.get('measurements').then(function(cm) {
                                                    cm.pushObject(newMeasurement);
                                                    done();
                                                });
                                            });
                                        });
                                    }
                                },

                                function done() {
                                    customer.save();
                                    console.log('customer saved successfully..');
                                    self.transitionToRoute('orders');
                                }
                            );
                        });
                    });
                });
            };

            var onOrderSaveFailure = function (error) {
                window.alert('Failed to save order..');
                console.log(error.message);
            }

            var onMeasurementsSaveSuccess = function () {
                console.log('measurements saved successfully..');
            };

            var onMeasurementsSaveFailure = function () {
                window.alert('Failed to save measurements..');
                console.log(error.message);
            };

            order.get('measurements').then(function(measurements) {
                console.log('Trying to save measurements..');
                var marr = measurements.toArray();
                async.forEach(marr,
                    function(measurement, done) {
                        App.Measurementhelper.saveMeasurement(measurement, done);
                    },
                    function done() {
                        console.log('measurements saved successfully..');
                        console.log('Trying to save order..');
                        order.save().then(onOrderSaveSuccess, onOrderSaveFailure);
                        self.get('removedMeasurements').forEach(function (rmeasurement) {
                            App.Measurementhelper.saveMeasurement(rmeasurement);
                        });
                    }
                );
            });
        },

        cancelOrder: function () {
            var order = this.get('model');
            var self = this;

            self.get('removedMeasurements').forEach(function (rmeasurement) {
                App.Measurementhelper.rollbackMeasurement(rmeasurement);
            });

            App.OrderCustomerCommonHelper.cancel(order, function(){
                self.transitionToRoute('orders');
            });
        },

        editMeasurement: function (measurement) {
            var order = this.get('model');
            var self = this;

            App.Measurementhelper.cloneMeasurement(measurement, self.store, function (editableMeasurement){
                self.send('openModal', 'measurement', editableMeasurement, measurement, order, false);
            });
        },

        removeMeasurement: function (measurement) {
            var order = this.get('model');

            order.get('measurements').removeObject(measurement);

            var isRecordNew = measurement.get('isNew');

            App.Measurementhelper.deleteMeasurement(measurement, false);

            if (!isRecordNew) {
                this.get('removedMeasurements').push(measurement);
            }
        },

        createMeasurement: function () {
            var self = this;
            var order = this.get('model');
            var measurement = self.store.createRecord('measurement');
            measurement.set('type', '');
            measurement.set('name', self.get('customername') );
            self.send('openModal', 'measurement', measurement, null, order, true);
        },

        getAllPreviousMeasurement: function () {
            var customerphno = this.get('customerphoneno');

            if (!customerphno) {
                window.alert('Enter customer phone numbers to get measurements');
                return;
            }

            var order = this.get('model');
            var self = this;

            this.store.find('order', { customerphoneno: customerphno, status: App.Consts.OrderState.Delivered }).then(function (orders) {

                if (orders.get('length') > 0) {
                    var orderArr = orders.toArray();
                    orderArr.sort(function(a,b){
                        return a.get('orderdate') < b.get('orderdate');
                    });
                    self.send('openModal', 'measurementSelect', orderArr, null, order, false);
                } else {
                    window.alert('No measurements found for customer with phone no ' + customerphno);
                }
            });
        },

        getRecentMeasurement: function () {
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
                        var marr = measurements.toArray();
                        for (var i = 0; i < marr.length; i++){
                            App.Measurementhelper.cloneMeasurement(marr[i], self.store, function(newMeasurement){
                                order.get('measurements').then(function(om) {
                                    om.pushObject(newMeasurement);
                                });
                            });
                        }
                    });
                } else {
                    window.alert('No measurements found for customer with phone no ' + customerphno);
                }
            });
        }

    },

    isNew: function() {
      console.log("calculating isNew");
      var id = this.get('content').get('id');
      return id;
  }.property() //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property
});


App.OrdersEditController.reopen({
    validations: {
        customername: {
            presence: true
        },
        nopieces: {
            presence: true,
            numericality: true
        }

    }
});