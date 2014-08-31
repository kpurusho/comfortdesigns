App.ApplicationRoute = Ember.Route.extend({
    init : function() {
        App.MeasurementConfigServiceInstance = App.MeasurementConfigService.create();
        App.MeasurementConfigServiceInstance.set('store', this.store);
    },
    actions: {
        openModal: function (modalName, model, originalModel, parentModel, isNew) {
            if (isNew !== undefined) {
                this.controllerFor(modalName).set('isNew', isNew);
            }

            this.controllerFor(modalName).set('model', model);

            if (parentModel) {
                this.controllerFor(modalName).set('parentModel', parentModel);
            }
            if (originalModel) {
                this.controllerFor(modalName).set('originalModel', originalModel);
            }

            return this.render(modalName, {
                into: 'application',
                outlet: 'modal',
                view: 'modal'
            });
        },

        closeModal: function () {
            return this.disconnectOutlet({
                outlet: 'modal',
                parentView: 'application'
            });
        }
    }
});