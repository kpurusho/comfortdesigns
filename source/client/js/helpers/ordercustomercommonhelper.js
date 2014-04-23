/**
 * Created by Karthik on 4/21/2014.
 */
App.OrderCustomerCommonHelper = {

    cancel : function(item, callback) {
        item.get('measurements').then(function (measurements) {
            var measurementsArr = measurements.toArray();
            async.forEach(measurementsArr, cancelMeasurement, cancelItem );
        });

        var cancelMeasurement = function (measurement, done) {
            if (measurement.get('isNew')) {
                item.get('measurements').removeObject(measurement);
                App.Measurementhelper.deleteMeasurement(measurement);
            }
            else {
                App.Measurementhelper.rollbackMeasurement(measurement);
            }
            done();
        }

        var cancelItem = function () {
            if (item.get('isNew')) {
                item.deleteRecord();
            }
            else {
                item.rollback();
            }
            if (callback) {
                callback();
            }
        }
    },
    delete : function(item, callback) {
        callback = callback || function () {};

        item.get('measurements').then(function (measurements) {
            var measurementsArr = measurements.toArray();
            async.forEach(measurementsArr, deleteMeasurement, deleteItem );
        });

        var deleteMeasurement = function (measurement, done) {
            App.Measurementhelper.deleteMeasurement(measurement, true, done);
        }

        var deleteItem = function () {
            var isNew = item.get('isNew');
            item.deleteRecord();
            if (!isNew) {
                item.save();
            }
            callback();
        }
    }

};
