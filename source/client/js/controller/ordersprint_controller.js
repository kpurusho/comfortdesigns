App.OrdersPrintController = Ember.ObjectController.extend({
    actions: {
        print: function () {
            window.print();
            this.transitionToRoute('orders');
        },

        close: function () {
            this.transitionToRoute('orders');
        }
    },
    tasks: function () {
        console.log('getting tasks for printing..');
        return this.store.find('task');
    }.property()
});