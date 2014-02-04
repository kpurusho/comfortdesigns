App.OrdersummaryController = Ember.ObjectController.extend({

    actions: {
        close: function () {
            return this.send('closeModal');
        }
    }
});