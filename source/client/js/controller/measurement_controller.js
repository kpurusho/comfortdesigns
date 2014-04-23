App.MeasurementController = Ember.ObjectController.extend({
    measurementtypes: [],
    measurementtype: '',

    init: function() {
        var self = this;
        this.store.find('measurementconfig').then(function(configs) {
            var types = [];
            var configArr = configs.toArray();
            var len = configArr.length;
            if (len > 0) {
               for (var i = 0; i < len; i++) {
                    types.push(configArr[i].get('type'));
                }
                self.set('measurementtypes', types);
            }
        });
    },

    selectionChanged: function () {
        var self = this;
        var measurement = this.get('model');
        var type = this.get('measurementtype');
        var isNew = this.get('isNew');

        if (type === '' || type === undefined || type === null || !isNew) return;

        this.store.find('measurementconfig', {'type': type}).then (function (configs) {
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
                    measurement.set('type', self.get('measurementtype'));
                    measurement.get('measurementitems').then(function(items) {
                        items.clear();
                        items.pushObjects(mitems);
                    });
                });
            }
        });
    }.observes('measurementtype'),

    parentModel: null,
    isNew: false,
    originalModel: null,

    actions: {
        close: function () {
            var measurement = this.get('model');
            App.Measurementhelper.deleteMeasurement(measurement);
            return this.send('closeModal');
        },
        updateMeasurement: function () {
            var measurement = this.get('model');
            var parent = this.get('parentModel');
            var isNew = this.get('isNew');
            var self = this;

            if (isNew) {
                parent.get('measurements').pushObject(measurement);
            }
            else {
                var orgmeasurement = this.get('originalModel');
                orgmeasurement.set('name', measurement.get('name'));
                measurement.get('measurementitems').then(function (items){
                    var itemArr = items.toArray();
                    orgmeasurement.get('measurementitems').then(function (oitems){
                        var oitemArr = oitems.toArray();
                        for(var i = 0; i < itemArr.length; i++) {
                            oitemArr[i].setProperties(itemArr[i].toJSON());
                        }
                        App.Measurementhelper.deleteMeasurement(measurement);
                    });
                });
            }
            return this.send('closeModal');
        }
    }
});
