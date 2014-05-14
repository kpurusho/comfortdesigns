/**
 * Created by Karthik on 5/13/14.
 */
App.MeasurementSelectController = Ember.ObjectController.extend({
    parentModel: null,
    isNew: false,
    originalModel: null,

    selectionState : function() {
        var ordersArr = this.get('model');
        async.forEach(ordersArr,
            function(order, orderDone){
                order.get('measurements').then(function(measurements) {
                        var measurementsArr = measurements.toArray();
                        async.forEach(measurementsArr,
                            function(measurement, measurementDone) {
                                measurement.set('selected', false);
                                measurementDone();
                            },

                            function measurementDone() {
                                orderDone();
                            }
                        );
                    }
                );
            },
            function orderDone() {
            }
        );
    }.observes('model'),

    actions: {
        ok : function() {
            var parentOrder = this.get('parentModel');
            var ordersArr = this.get('model');
            var self = this;
            async.forEach(ordersArr,
                function(order, orderDone){
                    order.get('measurements').then(function(measurements) {
                            var measurementsArr = measurements.toArray();
                            async.forEach(measurementsArr,
                                function(measurement, measurementDone) {
                                    if (measurement.get('selected')) {
                                        App.Measurementhelper.cloneMeasurement(measurement, self.store, function(newMeasurement){
                                            parentOrder.get('measurements').then(function(om) {
                                                om.pushObject(newMeasurement);
                                                measurementDone();
                                            });
                                        });
                                    } else {
                                        measurementDone();
                                    }
                                },

                                function measurementDone() {
                                    orderDone();
                                }
                            );
                        }
                    );
                },
                function orderDone() {
                    return self.send('closeModal');
                }
            );
        },
        cancel : function() {
            return this.send('closeModal');
        }
    }
});