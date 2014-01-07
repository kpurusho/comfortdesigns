App.TasksEditController = Ember.ObjectController.extend({
    actions: {
        updateItem: function () {
            var task = this.get('model');

            var that = this;
            var onSuccess = function () {
                console.log('task saved successfully..');
                that.transitionToRoute('tasks');
            };

            var onFailure = function (error) {
                window.alert('Failed to save..');
                console.log(error.message);
            }

            task.save().then(onSuccess, onFailure);
        }
    },

  isNew: function() {
    console.log("calculating isNew");
    return this.get('model').get('id');
  }.property() //.property() marks this function as property. check http://emberjs.com/api/classes/Function.html#method_property
});

