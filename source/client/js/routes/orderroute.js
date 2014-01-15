﻿App.OrdersIndexRoute = Ember.Route.extend({

    model: function () {
        return this.store.find('order');
    },

    renderTemplate: function () {
        this.render('orders.index', { into: 'application' });
    }
});

App.OrdersEditRoute = Ember.Route.extend({

    model : function(params) {
        return this.store.find('order', params.order_id);
    },

    setupController: function (controller, model) {
        this.controllerFor('orders.edit').setProperties({ isNew: false, model: model, editableMeasurement: null, removedMeasurements: [] });
    },

    renderTemplate: function () {
        //this renders the template tasks.edit into application template's outlet
        this.render('orders.edit', { into: 'application' });
    },

    actions: {
    error: function(error, transition) {
        // handle the error
        console.log(error.message);
    }
}
});

App.OrdersNewRoute = Ember.Route.extend({
    model: function () {
        return this.store.createRecord('order', {
            status: 'new'
        });
    },

    setupController: function (controller, model) {
        this.controllerFor('orders.edit').setProperties({ isNew: true, model: model, editableMeasurement: null, removedMeasurements: [] });
    },

    renderTemplate: function () {
        //this renders the same template tasks.edit into application template's outlet
        // isNew property is used to determine if it is a new task or an existing task
        this.render('orders.edit', { into: 'application' });
    }
});

