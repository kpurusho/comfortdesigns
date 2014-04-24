App.TasksIndexController = Ember.ArrayController.extend({

    editCounter: function () {
        return this.filterProperty('selected', true).get('length');
    }.property('@each.selected'),

    itemsSelected: function () {
        return this.get("editCounter") > 0;
    }.property('editCounter'),

    actions: {

        removeItem: function (task) {
            task.deleteRecord();
            task.get('isDeleted');
            task.save();
        }
    }
});

