App.Ordersummary = DS.Model.extend({
    duedate: DS.attr('date'),
    newcount: DS.attr('number'),
    inprogresscount: DS.attr('number'),
    donecount: DS.attr('number')
});



