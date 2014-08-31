App.MeasurementconfigsIndexRoute = Ember.Route.extend({

    model: function () {
        return this.store.find('measurementconfig');
    },

    renderTemplate: function () {
        //this renders the template tasks.index into application template's outlet
        this.render('measurementconfigsindex', { into: 'application' });
    }

});

App.MeasurementconfigsEditRoute = Ember.Route.extend({

    model: function (params) {
        //sets the content proerty in controller
        //return App.Task.find();
        return this.store.find('measurementconfig', params.config_id);
    },

    setupController: function (controller, m) {
        this.controllerFor('measurementconfigs.edit').setProperties({ isNew: false, model: m });
    },

    renderTemplate: function () {
        //this renders the template tasks.edit into application template's outlet
        this.render('measurementconfigsedit', { into: 'application' });
    }

});

App.MeasurementconfigsNewRoute = Ember.Route.extend({
    model: function () {
        //sets the content proerty in controller
        //return App.Task.find();
        return this.store.createRecord('measurementconfig');
    },

    setupController: function (controller, m) {
        this.controllerFor('measurementconfigs.edit').setProperties({ isNew: true, model: m });
    },

    renderTemplate: function () {
        //this renders the same template tasks.edit into application template's outlet
        // isNew property is used to determine if it is a new task or an existing task
        this.render('measurementconfigsedit', { into: 'application' });
    }

});

