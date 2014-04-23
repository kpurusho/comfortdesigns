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
            App.OrderCustomerCommonHelper.delete(customer);
        }}
});

