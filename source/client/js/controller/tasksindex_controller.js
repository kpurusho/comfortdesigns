App.TasksIndexController = Ember.ArrayController.extend({

    editCounter: function () {
        return this.filterProperty('selected', true).get('length');
    }.property('@each.selected'),

    itemsSelected: function () {
        return this.get("editCounter") > 0;
    }.property('editCounter'),

    removeItem: function (task) {
        task.on("didDelete", this, function () {
            console.log("record deleted");
        });

        task.deleteRecord();
        task.transaction.commit();
    },

    removeSelectedTasks: function () {
        arr = this.filterProperty('selected', true);
        if (arr.length == 0) {
            output = "nothing selected";
        } else {
            output = "";
            for (i = 0 ; i < arr.length ; i++) {
                arr[i].deleteRecord()
                arr[i].store.commit();
            }
        }
    },

    tasksPresent: function () {
        var itemsPresent = this.get('content').content.length > 0;
        console.log(" +++ Computed tasksPresent prop with value " + itemsPresent);
        return itemsPresent;
    }.property("content.@each")
    //}.property("content.isLoaded")
});

