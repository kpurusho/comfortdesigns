App.Router.map(function () {
    this.route('index', { path: '/' });
    this.route('about', { path: '/about' });

    this.resource('tasks', { path: 'tasks' }, function () {
        console.log('Inside tasks....');
        this.route('new', { path: '/new' });	//url : tasks/new, template: tasks/new, Route: TasksNewRoute, Controller: TasksNewController
        this.route('edit', { path: '/:task_id' });	//url : tasks/:task_id, template: tasks/edit, Route: TasksEditRoute, Controller: TasksEditController
        //automatically generated - //url: tasks/index, template; tasks/index, Route: TasksIndexRoute, Controller: TasksIndexController
    });

});

App.TasksIndexRoute = Ember.Route.extend({

    //model: function() {
    //sets the content proerty in controller
    //    return App.Task.find();
    //},

    //this does exactly what above model property does
    setupController: function (controller) {

        var tasks = App.Task.find();
        tasks.on('didLoad', function () {
            console.log(" +++ Tasks loaded!");
        });

        //controller is nothing but TasksIndexController
        //content property in controller provides actual list of objects required
        //for html binding
        //any handlebar enumeration done on controller works against the list of objects
        //returned by content property in controller
        //hence set content with list of model objects
        controller.set('content', tasks);
    },

    renderTemplate: function () {
        //this renders the template tasks.index into application template's outlet
        this.render('tasks.index', { into: 'application' });
    }

});

App.TasksEditRoute = Ember.Route.extend({

    setupController: function (controller, model) {
        this.controllerFor('tasks.edit').setProperties({ isNew: false, content: model });
    },

    renderTemplate: function () {
        //this renders the template tasks.edit into application template's outlet
        this.render('tasks.edit', { into: 'application' });
    }

});

App.TasksNewRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        this.controllerFor('tasks.edit').setProperties({ isNew: true, content: App.Task.createRecord() });
    },
    renderTemplate: function () {
        //this renders the same template tasks.edit into application template's outlet
        // isNew property is used to determine if it is a new task or an existing task
        this.render('tasks.edit', { into: 'application' });
    }

});

