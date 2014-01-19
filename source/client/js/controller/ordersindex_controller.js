App.OrdersIndexController = Ember.ArrayController.extend({

    editCounter: function () {
        return this.filterProperty('selected', true).get('length');
    }.property('@each.selected'),

    itemsSelected: function () {
        return this.get("editCounter") > 0;
    }.property('editCounter'),

    searchedCustomer: function () {
        var regexp = new RegExp(this.get('searchcustomer'), 'i');

        this.get('model').set('content', this.store.filter('order', function (item) {
            return regexp.test(item.get('customername')) || regexp.test(item.get('customerphoneno'));
        }));

    }.observes('searchcustomer'),

    searchedOrder: function () {
        var regexp = new RegExp(this.get('searchorder'), 'i');

        this.get('model').set('content', this.store.filter('order', function (item) {
            return regexp.test(item.get('orderno'));
        }));

    }.observes('searchorder'),

    actions: {

        searchItem: function () {
            var con = this.get('content.length');
            var searchvalue = this.get('search');
            var regexp = new RegExp(searchvalue);
            var filtered = this.get('model').filter(function (item) {
                return regexp.test(item.get('customername'));
            });
        },

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

