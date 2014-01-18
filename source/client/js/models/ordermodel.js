App.Order = DS.Model.extend({
    orderno: DS.attr('number'),
    orderdate: DS.attr('date'),
    customername: DS.attr('string'),
    customerphoneno: DS.attr('string'),
    customeremailid: DS.attr('string'),
    duedate: DS.attr('date'),
    nopieces: DS.attr('number'),
    status: DS.attr('string'),
    additionalnote: DS.attr('string'),
    measurements: DS.hasMany('measurement', { async: true })
});

App.Order.FIXTURES = [{
    id: 1,
    orderno: 1,
    orderdate: new Date(),
    customername: 'lavanya',
    customerphoneno: '9500037396',
    duedate: new Date(),
    measurements: [3]
}];