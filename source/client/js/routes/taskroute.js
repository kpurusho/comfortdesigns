App.TasksIndexRoute = Ember.Route.extend({

    model: function () {
        return this.store.find('task');
    },

    renderTemplate: function () {
        //this renders the template tasks.index into application template's outlet
        this.render('tasks.index', { into: 'application' });
    }

});
//
//App.TasksEditRoute = Ember.Route.extend({
//
//    model: function (params) {
//        //sets the content proerty in controller
//        //return App.Task.find();
//        return this.store.find('task', params.task_id);
//    },
//
//    setupController: function (controller, m) {
//        this.controllerFor('tasks.edit').setProperties({ isNew: false, model: m });
//    },
//
//    renderTemplate: function () {
//        //this renders the template tasks.edit into application template's outlet
//        this.render('tasks.edit', { into: 'application' });
//    }
//
//});
//
//App.TasksNewRoute = Ember.Route.extend({
//    model: function () {
//        //sets the content proerty in controller
//        //return App.Task.find();
//        return this.store.createRecord('task');
//    },
//
//    setupController: function (controller, m) {
//        this.controllerFor('tasks.edit').setProperties({ isNew: true, model: m });
//    },
//
//    renderTemplate: function () {
//        //this renders the same template tasks.edit into application template's outlet
//        // isNew property is used to determine if it is a new task or an existing task
//        this.render('tasks.edit', { into: 'application' });
//    }
//
//});
//
