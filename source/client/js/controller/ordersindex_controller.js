App.OrdersIndexController = Ember.ArrayController.extend({
    states: [App.Consts.OrderState.New, App.Consts.OrderState.InProgress, App.Consts.OrderState.Done, App.Consts.OrderState.Delivered],

    filterByStatusNew: false,
    filterByStatusInProgress: false,
    filterByStatusDone: false,
    filterByStatusDelivered: false,
    filterByDueDate: "0",

    filter: function () {
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

        var statuRegExp = new RegExp(pattern);
        var customerRegExp = new RegExp(this.get('searchcustomer'), 'i');
        var orderRegExp = new RegExp(this.get('searchorder'), 'i');

        var startDate = new Date();
        var endDate = new Date();

        var filterDueDate = this.get('filterByDueDate');
        switch (filterDueDate) {
            case "0":
                startDate = null;
                endDate = null;
                break;
            case "1":
                endDate.setDate(endDate.getDate() + 7);
                break;
            case "2":
                endDate.setDate(endDate.getDate() + 14);
                break;
            case "3":
                endDate.setDate(endDate.getDate() + 21);
                break;
            case "4":
                endDate.setDate(endDate.getDate() + 31);
                break;
        };


        this.get('model').set('content', this.store.filter('order', function (item) {
            return statuRegExp.test(item.get('status')) &&
                (startDate ? (startDate <= item.get('duedate') && item.get('duedate') <= endDate) : true) &&
                (customerRegExp.test(item.get('customername')) || customerRegExp.test(item.get('customerphoneno'))) &&
                orderRegExp.test(item.get('orderno'));
        }));

    }.observes('filterByStatusNew', 'filterByStatusInProgress',
                'filterByStatusDone', 'filterByStatusDelivered',
                'filterByDueDate',
                'searchcustomer',
                'searchorder'),

    editCounter: function () {
        return this.filterProperty('selected', true).get('length');
    }.property('@each.selected'),

    itemsSelected: function () {
        return this.get("editCounter") > 0;
    }.property('editCounter'),

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
        },

        orderStatusNext: function (order) {
            var length = this.states.length;
            var nextIdx = 0;
            for (var i = 0; i < length; i++) {
                if (this.states[i] === order.get('status')) {
                    if (i === (length - 1)) {
                        nextIdx = i;
                    }
                    else {
                        nextIdx = i + 1;
                    }
                }
            }
            order.set('status', this.states[nextIdx]);
            order.save();
        },
        orderStatusPrevious: function (order) {
            var length = this.states.length;
            var nextIdx = 0;
            for (var i = 0; i < length; i++) {
                if (this.states[i] === order.get('status')) {
                    if (i === 0) {
                        nextIdx = i;
                    }
                    else {
                        nextIdx = i - 1;
                    }
                }
            }
            order.set('status', this.states[nextIdx]);
            order.save();
        }
},
});

