App.MeasurementconfigsIndexController = Ember.ArrayController.extend({
    actions: {
        removeItem: function (config) {
            App.Measurementhelper.deleteMeasurementConfig(config);
        },
        copyItem: function (config) {
            App.Measurementhelper.copyMeasurementConfig(config, this.store);
        }
    }
});

