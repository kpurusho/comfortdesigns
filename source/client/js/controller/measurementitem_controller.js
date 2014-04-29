/**
 * Created by Karthik on 4/25/2014.
 */


App.MeasurementitemController = Ember.ObjectController.extend(Ember.Validations.Mixin);


App.MeasurementitemController.reopen({
    validations: {
        itemvalue: {
            numericality: true,
            measurementValidator: true
        }
    }
});
