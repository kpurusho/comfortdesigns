/**
 * Created by Karthik on 4/27/2014.
 */
Ember.Validations.validators.local.MeasurementValidator = Ember.Validations.validators.Base.extend({
    call: function () {
        var itemname = this.model.get('itemname');
        var measurementtype = this.model.get('parentController').get('model').get('type');
        var value = this.model.get(this.property);
        var self = this;

        App.MeasurementConfigServiceInstance.findMeasurementItemConfig(measurementtype, itemname, function(item) {
            if (value < item.get('min') || value > item.get('max')) {
                self.errors.pushObject("Value should be between [" + item.get('min') + "-" + item.get('max') + "]");
            }
        });
    }
});

