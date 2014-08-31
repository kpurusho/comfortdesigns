App.TasksIndexController = Ember.ArrayController.extend({

    editCounter: function () {
        return this.filterProperty('selected', true).get('length');
    }.property('@each.selected'),

    itemsSelected: function () {
        return this.get("editCounter") > 0;
    }.property('editCounter'),

    actions: {
        createTask: function () {
            var model = this.get('model');
            var item = this.store.createRecord('task');
            this.send('openModal', 'tasksEdit', item, null, model, true);
        },

        editTask : function (task) {
            this.send('openModal', 'tasksEdit', task, null, null, false);
        },

        removeTask: function (task) {
            task.deleteRecord();
            task.get('isDeleted');
            task.save();
        }
    }
});

