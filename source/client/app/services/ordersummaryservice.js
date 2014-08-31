App.StatusSummary = Ember.Object.extend({
    newcount: 0,
    inprogresscount: 0,
    donecount: 0
});

App.OrdersummaryService = Ember.Object.extend({
    store : null,

    totalnewcount: function(){
        return 0;
    }.property(),

    totalinprogresscount: function () {
        return 0;
    }.property(),

    totaldonecount: function () {
        return 0;
    }.property(),

    daywisesummary: function () {
        return null;
    }.property(),

    computesummary: function () {
        this.computecount();
        this.computedayandweekwisesummary();
    },

//    computedayandweekwisesummary: function (){
//
//        var daysummary = {};
//        var weeksummary = {};
//        var items = this.store.all('order');
//
//        var self = this;
//
//        items.forEach(function(item){
//            var daykey = daysummary[item.get('duedate')];
//            if (!daykey){
//                daykey = App.StatusSummary.create();
//                daysummary[item.get('duedate')] = daykey;
//            }
//
//            self.updatecounts(daykey,item);
//
//            var weekno = self.getweek(new Date(item.get('duedate')));
//            var weekkey = weeksummary[weekno];
//            if (!weekkey){
//                weekkey = App.StatusSummary.create();
//                weeksummary[weekno] = weekkey;
//            }
//
//            self.updatecounts(weekkey, item);
//        });
//
//        var daysummarytable = [];
//        var weeksummarytable = [];
//
//        for (var key in daysummary){
//            daysummarytable.push({
//                duedate: new Date(key),
//                newcount: daysummary[key].newcount,
//                inprogresscount: daysummary[key].inprogresscount,
//                donecount: daysummary[key].donecount
//            });
//        }
//        this.set('daywisesummary', daysummarytable);
//
//        for (var key in weeksummary){
//            weeksummarytable.push({
//                week: self.getWeekAsString(key),
//                newcount: weeksummary[key].newcount,
//                inprogresscount: weeksummary[key].inprogresscount,
//                donecount: weeksummary[key].donecount
//            });
//        }
//        this.set('weekwisesummary', weeksummarytable);
//    },

    computedayandweekwisesummary: function (){

        var daysummary = {};
        var weeksummary = {};

        var self = this;

        var items = this.store.filter('order', function(item){
            var daykey = daysummary[item.get('duedate').toDateString()];
            if (!daykey){
                daykey = App.StatusSummary.create();
                daysummary[item.get('duedate').toDateString()] = daykey;
            }

            self.updatecounts(daykey,item);

            var weekno = self.getweek(new Date(item.get('duedate')));
            var weekkey = weeksummary[weekno];
            if (!weekkey){
                weekkey = App.StatusSummary.create();
                weeksummary[weekno] = weekkey;
            }

            self.updatecounts(weekkey, item);
            return true;
        });

        var daysummarytable = [];
        var weeksummarytable = [];

        for (var key in daysummary){
            daysummarytable.push({
                duedate: new Date(key),
                newcount: daysummary[key].newcount,
                inprogresscount: daysummary[key].inprogresscount,
                donecount: daysummary[key].donecount
            });
        }
        daysummarytable.sort(function(a,b){
            return a.duedate > b.duedate;
        });
        this.set('daywisesummary', daysummarytable);

        for (var wk in weeksummary){
            weeksummarytable.push({
                week: self.getWeekAsString(wk),
                newcount: weeksummary[wk].newcount,
                inprogresscount: weeksummary[wk].inprogresscount,
                donecount: weeksummary[wk].donecount
            });
        }
        this.set('weekwisesummary', weeksummarytable);
    },

    getWeekAsString : function (week){
        var weekno = parseInt(week);
        if (weekno === 0){
            return 'This Week';
        }
        if (weekno < 0) {
            return 'Previous Week ' + (weekno * -1).toString();
        }
        return 'Week ' + weekno.toString();
    },


    updatecounts : function(key, item){
        if (item.get('status') === App.Consts.OrderState.New){
            key.set('newcount', key.get('newcount') + 1);
        }
        if (item.get('status') === App.Consts.OrderState.InProgress){
            key.set('inprogresscount', key.get('inprogresscount') + 1);
        }
        if (item.get('status') === App.Consts.OrderState.Done){
            key.set('donecount', key.get('donecount') + 1);
        }
    },

    getweek : function(date){
        var today = new Date();
        var daysleftthisweek = ((6 - today.getDay() + 1)%7) + 1;
        today.setDate(today.getDate() - (7-daysleftthisweek));
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        return this.weeksbetween(today, date);
    },

    weeksbetween : function( date1, date2 ) {
        //Get 1 day in milliseconds
        var one_week=1000*60*60*24*7;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.floor(difference_ms/one_week);
    },

    computecount: function(){
        var self = this;
        var newitems = this.store.filter('order', function (item) {
            return item.get('status') === App.Consts.OrderState.New;
        });
        self.set('totalnewcount', newitems.get('length'));

        var inprogressitems = this.store.filter('order', function (item) {
            return item.get('status') === App.Consts.OrderState.InProgress;
        });
        self.set('totalinprogresscount', inprogressitems.get('length'));

        var doneitems = this.store.filter('order', function (item) {
            return item.get('status') === App.Consts.OrderState.Done;
        });
        self.set('totaldonecount', doneitems.get('length'));
    }
});
