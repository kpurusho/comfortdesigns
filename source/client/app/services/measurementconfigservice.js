App.MeasurementConfigService = Ember.Object.extend({
    store: null,

    createMeasurementItems :  function(measurementtype, callback) {
        callback = callback || function (items) { };
        var self = this;

        this.store.find('measurementconfig', {'type': measurementtype}).then (function (configs) {
            if (configs.get('length') > 0) {
                var config = configs.objectAt(0);

                config.get('measurementitems').then(function (measurementitems) {
                    var marr = measurementitems.toArray();
                    var len = marr.length;
                    var mitems = [];
                    for (var i = 0; i < len; i++) {
                        var newMeasurementitem = self.store.createRecord('measurementitem');
                        newMeasurementitem.set('itemname', marr[i].get('itemname'));
                        newMeasurementitem.set('itemvalue', marr[i].get('itemvalue'));
                        mitems.push(newMeasurementitem);
                    }
                    callback(mitems);
                });
            }
        });
    },

    findMeasurementItemConfig : function(measurementype, itemname, callback) {
        callback = callback || function (m) {};

        this.store.find('measurementconfig', {type: measurementype}).then(function(configs) {
            if (configs.get('length') > 0) {
                var config = configs.objectAt(0);

                config.get('measurementitems').then(function (measurementitems) {
                    var marr = measurementitems.toArray();
                    var len = marr.length;
                    var item = null;
                    for (var i = 0; i < len; i++) {
                        if (marr[i].get('itemname') === itemname) {
                            item = marr[i];
                            break;
                        }
                    }
                    callback(item);
                });
            }
        });
    },

    findMeasurementTypes : function(callback) {
        callback = callback || function (types) { };

        this.store.find('measurementconfig').then(function (configs) {
            var types = [];
            var configArr = configs.toArray();
            var len = configArr.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    types.push(configArr[i].get('type'));
                }
                callback(types);
            }
        });
    }


});

App.MeasurementConfigServiceInstance = null;