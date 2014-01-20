App.OrdersPrintController = Ember.ObjectController.extend({
    actions: {
        printOrder: function () {
        },

        cancel: function () {
            this.transitionToRoute('orders');
        }
    },
    tasks: function () {
        console.log('getting tasks for printing..');
        return this.store.find('task');
    }.property()
});