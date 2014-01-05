App.TasksEditController = Ember.ObjectController.extend({
    actions: {
        updateItem: function () {
            var task = this.get('model');
            task.save();
            this.transitionToRoute('tasks'); //TODO: to move this on success of save
        }
    },

  isNew: function() {
    console.log("calculating isNew");
    return this.get('model').get('id');
  }.property() //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property
});

