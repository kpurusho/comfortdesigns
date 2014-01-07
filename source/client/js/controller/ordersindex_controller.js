App.OrdersIndexController = Ember.ArrayController.extend({

    editCounter: function () {
        return this.filterProperty('selected', true).get('length');
    }.property('@each.selected'),

    itemsSelected: function () {
        return this.get("editCounter") > 0;
    }.property('editCounter'),

    actions: {

        removeItem: function (order) {
            order.deleteRecord();
            order.get('isDeleted');
            order.save();
        },

        removeSelectedOrders: function () {
            arr = this.filterProperty('selected', true);
            if (arr.length == 0) {
                output = "nothing selected";
            } else {
                output = "";
                for (i = 0 ; i < arr.length ; i++) {
                    arr[i].deleteRecord();
                    arr[i].get('isDeleted');
                    arr[i].save();
                }
            }
        }
    },
});

