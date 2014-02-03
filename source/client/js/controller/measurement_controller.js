App.MeasurementController = Ember.ObjectController.extend({
    measurementtypes: [App.Consts.MeasurementType.Blouse, App.Consts.MeasurementType.Chudidhar],

    parentModel: null,
    isNew: false,
    originalModel: null,

    actions: {
        close: function () {
            var measurement = this.get('model');
            measurement.deleteRecord();
            return this.send('closeModal');
        },
        updateMeasurement: function () {
            var measurement = this.get('model');
            var customer = this.get('parentModel');
            var isNew = this.get('isNew');

            if (isNew) {
                customer.get('measurements').pushObject(measurement);
            }
            else {
                this.get('originalModel').setProperties(measurement.toJSON());
                measurement.deleteRecord();
            }
            return this.send('closeModal');
        }
    }
});
