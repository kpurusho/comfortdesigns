App.Router.map(function () {
    this.route('index', { path: '/' });
    this.route('about', { path: '/about' });

    this.resource('tasks', { path: 'tasks' }, function () {
        console.log('Inside tasks....');
        this.route('new', { path: '/new' });	//url : tasks/new, template: tasks/new, Route: TasksNewRoute, Controller: TasksNewController
        this.route('edit', { path: '/:task_id' });	//url : tasks/:task_id, template: tasks/edit, Route: TasksEditRoute, Controller: TasksEditController
        //automatically generated - //url: tasks/index, template; tasks/index, Route: TasksIndexRoute, Controller: TasksIndexController
    });

    this.resource('customers', { path: 'customers' }, function () {
        console.log('Inside customers....');
        this.route('new', { path: '/new' });
        this.route('edit', { path: '/:cust_id' });

        this.resource('measurements', { path: 'measurements' }, function () {
            console.log('Inside measurements....');
            this.route('new', { path: '/new' });
            this.route('edit', { path: '/:measurement_id' });
        });

    });
});

