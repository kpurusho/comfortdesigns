App.Order = DS.Model.extend({
    orderno: DS.attr('number'),
    orderdate: DS.attr('date'),
    customername: DS.attr('string'),
    customerphoneno: DS.attr('string'),
    duedate: DS.attr('date'),
    nopieces: DS.attr('number'),
    status: DS.attr('string'),
    measurements: DS.hasMany('measurement', { async: true })
});
