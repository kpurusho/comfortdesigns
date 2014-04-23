Ember.Handlebars.helper('format-date', function (date) {
    if (date)  {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return "%@-%@-%@".fmt(day, month, date.getFullYear());
    }
});