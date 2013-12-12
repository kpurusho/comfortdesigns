App.Router.map(function() {
  this.route('index', { path: '/' });
  this.route('about', { path: '/about' });

  this.resource('tasks', { path: 'tasks' }, function(){
      console.log('Inside tasks....');
      this.route('new', {path:'/new'});	//url : tasks/new, template: tasks/new, Route: TasksNewRoute, Controller: TasksNewController
      this.route('edit', {path: '/:task_id' });	//url : tasks/:task_id, template: tasks/edit, Route: TasksEditRoute, Controller: TasksEditController
      //automatically generated - //url: tasks/index, template; tasks/index, Route: TasksIndexRoute, Controller: TasksIndexController
  });

});

App.TasksIndexRoute = Ember.Route.extend({

  setupController: function(controller) {

    var tasks = App.Task.find();
    tasks.on('didLoad', function() {
      console.log(" +++ Tasks loaded!");
    });

    controller.set('content', tasks);
  },

  renderTemplate: function() {
    this.render('tasks.index',{into:'application'});
  }

});

App.TasksEditRoute = Ember.Route.extend({

  setupController: function(controller, model) {
      this.controllerFor('tasks.edit').setProperties({isNew: false,content:model});
  },

  renderTemplate: function() {
    this.render('tasks.edit',{into:'application'});
  }

});

App.TasksNewRoute = Ember.Route.extend({
  setupController: function(controller, model) {
        this.controllerFor('tasks.edit').setProperties({isNew: true,content:App.Task.createRecord()});
  },
  renderTemplate: function() {
    this.render('tasks.edit',{into:'application'});
  }

});

