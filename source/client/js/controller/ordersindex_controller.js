App.OrdersIndexController = Ember.ArrayController.extend({
    states: [App.Consts.OrderState.New, App.Consts.OrderState.InProgress, App.Consts.OrderState.Done, App.Consts.OrderState.Delivered],

    //contentBinding: Ember.Binding.oneway("App.OrdersIndexController.content"),

    sortProperties: ['orderno'],
    sortAscending: false,

    filterByStatusNew: false,
    filterByStatusInProgress: false,
    filterByStatusDone: false,
    filterByStatusDelivered: false,
    filterByDueDate: "0",

    ordersummary: function () {
        //return this.store.find('ordersummary');
        var summary = App.OrdersummaryService.create();
        summary.set('store', this.store);
        summary.computesummary();
        return summary;
    }.property('model.@each.status'),

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
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);

        var endDate = new Date(startDate);

        //week is from monday to sunday

        var daysleftthisweek = ((6 - startDate.getDay() + 1)%7) + 1;

        var filterDueDate = this.get('filterByDueDate');
        switch (filterDueDate) {
            case "0":
                startDate = undefined;
                endDate = undefined;
                break;
            case "-1":
                startDate = undefined;
                break;
            case "1":
                endDate.setDate(startDate.getDate() + daysleftthisweek);
                break;
            case "2":
                endDate.setDate(startDate.getDate() + daysleftthisweek + 7);
                break;
            case "3":
                endDate.setDate(startDate.getDate() + daysleftthisweek + 14);
                break;
            case "4":
                endDate.setDate(startDate.getDate() + daysleftthisweek + 21);
                break;
        };

        var self = this;
        if (filterDelivered) {
            this.store.find('order').then(function (orders) {
                self.get('model').set('content', self.store.filter('order', function (item) {
                    return statuRegExp.test(item.get('status')) &&
                        (startDate != undefined ? (startDate.getTime() <= item.get('duedate').getTime()) : true) &&
                        (endDate != undefined ? (item.get('duedate').getTime() < endDate.getTime()) : true) &&
                        (customerRegExp.test(item.get('customername')) || customerRegExp.test(item.get('customerphoneno'))) &&
                        orderRegExp.test(item.get('orderno'));
                }));
                $("table").trigger("update");
            });
        }
        else {
            self.get('model').set('content', self.store.filter('order', function (item) {
                return statuRegExp.test(item.get('status')) &&
                    (startDate != undefined ? (startDate.getTime() <= item.get('duedate').getTime()) : true) &&
                    (endDate != undefined ? (item.get('duedate').getTime() < endDate.getTime()) : true) &&
                    (customerRegExp.test(item.get('customername')) || customerRegExp.test(item.get('customerphoneno'))) &&
                    orderRegExp.test(item.get('orderno'));
            }));
            $("table").trigger("update");
        }
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

        sortColumn: function (colname){
            var sp = this.get('sortProperties');
            if (sp.length === 1 && sp[0]===colname){
                var sortorder = this.get('sortAscending');
                sortorder = sortorder ? false : true;
                this.set('sortAscending', sortorder);
            }
            else{
                this.set('sortProperties', [colname]);
                this.set('sortAscending', true);
            }
        },

        searchItem: function () {
            var con = this.get('content.length');
            var searchvalue = this.get('search');
            var regexp = new RegExp(searchvalue);
            var filtered = this.get('model').filter(function (item) {
                return regexp.test(item.get('customername'));
            });
        },

        removeItem: function (order) {
            var self = this;
            App.OrderCustomerCommonHelper.delete(order, function() {
                self.filter();
            });
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
}
});

