/**
 * Created by Karthik on 4/23/2014.
 */
App.MeasurementitemconfigController = Ember.ObjectController.extend(Ember.Validations.Mixin, {
    parentModel: null,
    isNew: false,
    originalModel: null,

    actions: {
        updateMeasurementItemConfig: function () {
            var measurementitem = this.get('model');
            var parent = this.get('parentModel');
            var isNew = this.get('isNew');
            var self = this;

            if (isNew) {
                parent.get('measurementitems').pushObject(measurementitem);
            }
            return this.send('closeModal');
        }
    }

});

App.MeasurementitemconfigController.reopen({
    validations: {
        itemname: {
            presence: true
        },
        min : {
            presence: true,
            numericality: true
        },
        max : {
            presence: true,
            numericality: true
        }
    }
});
