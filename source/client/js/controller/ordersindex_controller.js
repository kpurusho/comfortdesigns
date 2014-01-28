App.OrdersIndexController = Ember.ArrayController.extend({

    filterByStatusNew: false,
    filterByStatusInProgress: false,
    filterByStatusDone: false,
    filterByStatusDelivered: false,

    filterByStatus: function () {
        var filterNew = this.get('filterByStatusNew');
        var filterInProgress = this.get('filterByStatusInProgress');
        var filterDone = this.get('filterByStatusDone');
        var filterDelivered = this.get('filterByStatusDelivered');
        var filterNone = !(filterNew || filterInProgress || filterDone || filterDelivered);

        var pattern = filterNew ? App.Consts.OrderState.New + '|' : '';
        pattern += filterInProgress ? App.Consts.OrderState.InProgress + '|' : '';
        pattern += filterDone ? App.Consts.OrderState.Done + '|' : '';
        pattern += filterDelivered ? App.Consts.OrderState.Delivered + '|' : '';

        pattern = pattern.substring(0, pattern.length - 1);

        var regExp = new RegExp(pattern);

        this.get('model').set('content', this.store.filter('order', function (item) {
            return regExp.test(item.get('status'));
        }));
    }.observes('filterByStatusNew', 'filterByStatusInProgress', 'filterByStatusDone', 'filterByStatusDelivered'),


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

