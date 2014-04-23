App.Ordersummary = DS.Model.extend({
    duedate: DS.attr('date'),
    newcount: DS.attr('number'),
    inprogresscount: DS.attr('number'),
    donecount: DS.attr('number')
});



App.Ordersummary.FIXTURES  = [
    {
        id: 1,
        duedate: new Date(),
        newcount: 1,
        inprogresscount: 1,
        donecount: 1
    }
];
