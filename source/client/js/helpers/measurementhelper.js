App.Measurementhelper = {

    cloneMeasurement : function(measurement, store, callback) {
        callback = callback || function (m) {};

        var clonedMeasurement = store.createRecord('measurement', measurement.toJSON());
        measurement.get('measurementitems').then(function (items){
            var itemArr = items.toArray();
            clonedMeasurement.get('measurementitems').then(function (eitems){
                for(var i = 0; i < itemArr.length; i++) {
                    eitems.pushObject(store.createRecord('measurementitem', itemArr[i].toJSON()));
                }
                callback(clonedMeasurement);
            });
        });
    },

    copyMeasurement : function(source, dest, callback) {
        callback = callback || function () {};

        dest.set('name', source.get('name'));
        dest.get('type', source.get('type'));
        source.get('measurementitems').then(function (sitems){
            var sitemArr = sitems.toArray();
            dest.get('measurementitems').then(function (ditems){
                var ditemArr = ditems.toArray();
                for(var i = 0; i < sitemArr.length; i++) {
                    ditemArr[i].setProperties(sitemArr[i].toJSON());
                }
                callback();
            });
        });
    },

    deleteMeasurement : function(measurement, doSave, callback) {
        if (doSave === undefined || doSave === null) {
            doSave = true;
        }
        callback = callback || function () {};

        measurement.get('measurementitems').then(function(items){
            var itemArr = items.toArray();
            for(var i = 0; i < itemArr.length; i++) {
                var isNew = itemArr[i].get('isNew');
                itemArr[i].deleteRecord();
                if (doSave && !isNew) {
                    itemArr[i].save();
                }
            }
            var isNew = measurement.get('isNew');
            measurement.deleteRecord();
            if (doSave && !isNew) {
                measurement.save();
            }

            callback();
        });
    },

    rollbackMeasurement : function(measurement, callback) {
        callback = callback || function () {};

        measurement.get('measurementitems').then(function(items){
            var itemArr = items.toArray();
            for(var i = 0; i < itemArr.length; i++) {
                itemArr[i].rollback();
            }
            measurement.rollback();

            callback();
        });
    },

    saveMeasurement : function(measurement, callback) {
        callback = callback || function () {};

        measurement.get('measurementitems').then(function(items){
            var itemArr = items.toArray();
            var saveItems = new Array();
            for(var i = 0; i < itemArr.length; i++) {
                saveItems.push(itemArr[i].save());
            }

            Ember.RSVP.all(saveItems).then(function () {
                measurement.save().then(function () {
                    callback();
                });
            });
        });
    },

    saveMeasurementConfig : function(config, success, failure) {
        success = success || function () {};
        failure = failure || function () {};

        config.get('measurementitems').then(function(items){
            var itemArr = items.toArray();
            var saveItems = new Array();
            for(var i = 0; i < itemArr.length; i++) {
                saveItems.push(itemArr[i].save());
            }

            Ember.RSVP.all(saveItems).then(function () {
                config.save().then (success, failure);
            });
        });
    }
}