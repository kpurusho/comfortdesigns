App.TasksEditController = Ember.ObjectController.extend({
  updateItem: function(task) {
    task.transaction.commit();
    this.get("target").transitionTo("tasks");
  },

  isNew: function() {
    console.log("calculating isNew");
    return this.get('content').get('id');
  }.property() //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property


});

