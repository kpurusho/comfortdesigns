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

    copyMeasurement : function(source, dest, store, callback) {
        callback = callback || function () {};

        dest.set('name', source.get('name'));
        dest.get('type', source.get('type'));
        source.get('measurementitems').then(function (sitems){
            var sitemArr = sitems.toArray();
            dest.get('measurementitems').then(function (ditems){
                var ditemArr = ditems.toArray();

                async.forEach(sitemArr, function(item, done) {
                    var found = false;
                    for(var i = 0; i < ditemArr.length; i++) {
                        if (ditemArr[i].get('itemname') === item.get('itemname') ) {
                            ditemArr[i].setProperties(sitemArr[i].toJSON());
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        ditems.pushObject(store.createRecord('measurementitem', item.toJSON()));
                    }
                    done();
                }, function done() {
                    callback(dest);
                });
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
                var isItemNew = itemArr[i].get('isNew');
                itemArr[i].deleteRecord();
                if (doSave && !isItemNew) {
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
            var saveItems = [];
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
            var saveItems = [];
            for(var i = 0; i < itemArr.length; i++) {
                saveItems.push(itemArr[i].save());
            }

            Ember.RSVP.all(saveItems).then(function () {
                config.save().then (success, failure);
            });
        });
    },

    copyMeasurementConfig : function(config, store, callback) {
        callback = callback || function () {};

        var newConfig = store.createRecord('measurementconfig', {type: config.get('type') + '_new'});

        config.get('measurementitems').then(function(items){
            var itemArr = items.toArray();
            var newItems = [];
            for(var i = 0; i < itemArr.length; i++) {
                var newItem = store.createRecord('measurementitemconfig', itemArr[i].toJSON());
                newItems.push(newItem);
            }

            async.forEach(newItems,
                function(newItem, done) {
                    newItem.save().then(function () {
                        done();
                    });
                },
                function done(){
                    newConfig.get('measurementitems').then(function(nitems) {
                        nitems.pushObjects(newItems);
                        newConfig.save().then( function() {
                            callback();
                        },
                        function(error) {
                            window.alert('Failed to save. Reason: ' + error.responseJSON.message);
                            App.Measurementhelper.deleteMeasurementConfig(newConfig);
                        }
                        );
                });
            });
        });

    },

    deleteMeasurementConfig : function(measurement, doSave, callback) {
        if (doSave === undefined || doSave === null) {
            doSave = true;
        }
        callback = callback || function () {};

        measurement.get('measurementitems').then(function(items){
            var itemArr = items.toArray();
            for(var i = 0; i < itemArr.length; i++) {
                var isItemNew = itemArr[i].get('isNew');
                itemArr[i].deleteRecord();
                if (doSave && !isItemNew) {
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
    }
};