/**
 * Created by Karthik on 5/1/2014.
 */


App.DateField = Ember.TextField.extend({
    didInsertElement: function () {
        var that = this;
        return this.$().datepicker().on('changeDate', function () {
            that.$().trigger('change');
        });
    }
});

App.DatePicker = Ember.TextField.extend({
    classNames: ['date-picker'],
    textToDateTransform: (function (key, value) {
        var date, month, parts;
        if (arguments.length === 2) {
            if (value instanceof Date) {
                this.set('date', date);
                return this.close();
            } else if (value && /\d{2}-\d{2}-\d{2}/.test(value)) {
                parts = value.split('-');
                date = new Date();
                date.setDate(parts[0]);
                date.setMonth(parts[1] - 1);
                date.setYear(parts[2]);
                this.set('date', date);
                return this.close();
            } else {
                return this.set('date', null);
            }
        } else if (arguments.length === 1 && this.get('date')) {
            month = this.get('date').getMonth() + 1;
            date = this.get('date').getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (date < 10) {
                date = "0" + date;
            }
            return "%@-%@-%@".fmt(date, month, this.get('date').getFullYear());
        }
    }).property(),
    format: "dd-mm-yyyy",
    placeholder: Ember.computed.alias('format'),
    size: 8,
    valueBinding: "textToDateTransform",
    yesterday: (function () {
        var date;
        date = new Date();
        date.setDate(date.getDate() - 1);
        return date;
    }).property(),
    didInsertElement: function () {
        var _this = this;
        return this.$().datepicker({
            format: this.get('format'),
            autoclose: true,
            todayHighlight: true,
            keyboardNavigation: false
        }).on('changeDate', function (ev) {
            _this.set('date', ev.date);
            return _this.$().datepicker('setValue', ev.date);
        });
    },
    close: function () {
        return this.$().datepicker('hide');
    }
});

