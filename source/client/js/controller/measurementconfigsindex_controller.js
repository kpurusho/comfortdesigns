App.MeasurementconfigsIndexController = Ember.ArrayController.extend({
    actions: {
        removeItem: function (config) {
            config.deleteRecord();
            config.get('isDeleted');
            config.save();
        }}
});

