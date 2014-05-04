App.MeasurementconfigsEditController = Ember.ObjectController.extend({
    actions: {
        updateMeasurementType: function () {
            var config = this.get('model');

            var that = this;
            var onSuccess = function () {
                console.log('config saved successfully..');
                that.transitionToRoute('measurementconfigs');
            };

            var onFailure = function (error) {
                window.alert('Failed to save. Reason: ' + error.responseJSON.message);
                //console.log(error.message);
            }

            App.Measurementhelper.saveMeasurementConfig(config,onSuccess, onFailure);
        },
        editMeasurementItemConfig: function(item) {
            this.send('openModal', 'measurementitemconfig', item, null, null, false);
        },
        createMeasurementItemConfig: function() {
            var model = this.get('model');
            var item = this.store.createRecord('measurementitemconfig')
            this.send('openModal', 'measurementitemconfig', item, null, model, true);
        }
    },

    isNew: function() {
        console.log("calculating isNew");
        return this.get('model').get('id');
    }.property() //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property
});

