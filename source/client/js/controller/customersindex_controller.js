App.CustomersIndexController = Ember.ArrayController.extend({

    editCounter: function () {
        return this.filterProperty('selected', true).get('length');
    }.property('@each.selected'),

    itemsSelected: function () {
        return this.get("editCounter") > 0;
    }.property('editCounter'),

    searchedCustomer: function () {
        var regexp = new RegExp(this.get('searchcustomer'), 'i');

        this.get('model').set('content', this.store.filter('customer', function (item) {
            return regexp.test(item.get('name')) || regexp.test(item.get('phoneno'));
        }));

    }.observes('searchcustomer'),

    actions: {

        removeItem: function (customer) {
            customer.deleteRecord();
            customer.get('isDeleted');
            customer.save();
        },

        removeSelectedCustomers: function () {
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

