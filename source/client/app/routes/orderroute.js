App.OrdersIndexRoute = Ember.Route.extend({

    model: function () {
        return this.store.find('order', {'status' : ['New','InProgress','Done']});
    },

    setupController: function (controller, model) {
        this.controllerFor('orders.index').setProperties({
            model: model, filterByStatusNew: true, filterByStatusInProgress: true,
            filterByStatusDone: true, filterByStatusDelivered: false, filterByDueDate: "0"
        });
    },

    renderTemplate: function () {
        this.render('ordersindex', { into: 'application' });
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
        this.render('ordersedit', { into: 'application' });
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
            status: 'New',
            orderdate: new Date(),
            duedate: new Date()
        });
    },

    setupController: function (controller, model) {
        this.controllerFor('orders.new').setProperties({ isNew: true, model: model, editableMeasurement: null, removedMeasurements: [] });
    },

    renderTemplate: function () {
        //this renders the same template tasks.edit into application template's outlet
        // isNew property is used to determine if it is a new task or an existing task
        this.render('ordersedit', { into: 'application' });
    }
});


App.OrdersPrintRoute = Ember.Route.extend({
    model: function (params) {
        return this.store.find('order', params.order_id);
    },

    setupController: function (controller, model) {
        console.log('setting controller for print page');
        this.controllerFor('orders.print').setProperties({ model: model});
    },

    renderTemplate: function () {
        //this renders the template tasks.edit into application template's outlet
        this.render('ordersprint', { into: 'application' });
    },

    actions: {
        error: function (error, transition) {
            // handle the error
            console.log(error.message);
        }
    }
});
