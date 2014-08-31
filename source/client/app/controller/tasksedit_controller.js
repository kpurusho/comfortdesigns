App.TasksEditController = Ember.ObjectController.extend(Ember.Validations.Mixin, {
    parentModel: null,
    isNew: false,
    originalModel: null,


    actions: {
        updateTask: function () {
            var task = this.get('model');
            var parent = this.get('parentModel');
            var isNew = this.get('isNew');
            var self = this;

            var that = this;
            var onSuccess = function () {
                console.log('task saved successfully..');
                that.transitionToRoute('tasks');
            };

            var onFailure = function (error) {
                window.alert('Failed to save..');
                console.log(error.message);
            };

            task.save().then(onSuccess, onFailure);
            return this.send('closeModal');
        }
    }
});


App.TasksEditController.reopen({
    validations: {
        taskname: {
            presence: true
        },
        seqid : {
            presence: true,
            numericality: true
        }
    }
});
