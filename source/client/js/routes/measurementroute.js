App.MeasurementsIndexRoute = Ember.Route.extend({

    model: function () {
        return this.store.find('measurement');
    },

    renderTemplate: function () {
        this.render('measurements.index', { into: 'application' });
    }
});

App.MeasurementsEditRoute = Ember.Route.extend({

    model : function(params) {
        return this.store.find('measurement', params.measurement_id);
    },

    setupController: function (controller, model) {
        this.controllerFor('measurements.edit').setProperties({ isNew: false, model: model });
    },

    renderTemplate: function () {
        //this renders the template tasks.edit into application template's outlet
        this.render('measurements.edit', { into: 'application' });
    }

});

App.MeasurementsNewRoute = Ember.Route.extend({
    model: function () {
        return this.store.createRecord('measurement');
    },

    setupController: function (controller, model) {
        this.controllerFor('measurements.edit').setProperties({ isNew: true, model: model });
    },

    renderTemplate: function () {
        //this renders the same template tasks.edit into application template's outlet
        // isNew property is used to determine if it is a new task or an existing task
        this.render('measurements.edit', { into: 'application' });
    }
});

