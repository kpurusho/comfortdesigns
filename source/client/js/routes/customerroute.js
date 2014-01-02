﻿App.CustomersIndexRoute = Ember.Route.extend({

    model: function () {
        return this.store.find('customer');
    },

    renderTemplate: function () {
        this.render('customers.index', { into: 'application' });
    }
});

App.CustomersEditRoute = Ember.Route.extend({

    model : function(params) {
        return this.store.find('customer', params.cust_id);
    },

    setupController: function (controller, model) {
        this.controllerFor('customers.edit').setProperties({ isNew: false, model: model });
    },

    renderTemplate: function () {
        //this renders the template tasks.edit into application template's outlet
        this.render('customers.edit', { into: 'application' });
    }

});

App.CustomersNewRoute = Ember.Route.extend({
    model: function () {
        return this.store.createRecord('customer');
    },

    setupController: function (controller, model) {
        this.controllerFor('customers.edit').setProperties({ isNew: true, model: model });
    },

    renderTemplate: function () {
        //this renders the same template tasks.edit into application template's outlet
        // isNew property is used to determine if it is a new task or an existing task
        this.render('customers.edit', { into: 'application' });
    }
});
