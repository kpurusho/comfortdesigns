App.MeasurementController = Ember.ObjectController.extend(Ember.Validations.Mixin, {
    measurementtypes: [],
    measurementtype: '',

    init: function() {
        var self = this;
        App.MeasurementConfigServiceInstance.findMeasurementTypes(function(types) {
            self.set('measurementtypes', types);
        });

        this._super();
    },

    selectionChanged: function () {
        var self = this;
        var measurement = this.get('model');
        var type = this.get('measurementtype');
        var isNew = this.get('isNew');

        if (type === '' || type === undefined || type === null || !isNew) return;

        App.MeasurementConfigServiceInstance.createMeasurementItems(type, function(mitems) {
                    measurement.set('type', self.get('measurementtype'));
                    measurement.get('measurementitems').then(function(items) {
                        items.clear();
                        items.pushObjects(mitems);
                    });
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
            this.set('measurementtype', '');
            return this.send('closeModal');
        }
    }
});

App.MeasurementController.reopen({
    validations: {
        name: {
            presence: true
        }
    }
});