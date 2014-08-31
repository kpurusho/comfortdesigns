App.Measurement = DS.Model.extend({
    type: DS.attr('string'),
    name: DS.attr('string'),
    measurementitems: DS.hasMany('measurementitem', { async: true }),
    additionalnote: DS.attr('string')
});

App.Measurementitem = DS.Model.extend({
    itemname : DS.attr('string'),
    itemvalue : DS.attr('number')
});


//App.Measurement.reopen()
App.Measurement.FIXTURES = [{
    id: 1,
    type: 'SK',
    name: 'main',
    measurementitems: [1,2],
    additionalnode: ''
    //customer: 1
}, {
    id: 2,
    type: 'BL',
    name: 'main',
    measurementitems: [1,2],
    additionalnode: ''
    //customer: 1
}, {
    id: 3,
    type: 'SK',
    name: 'kid',
    measurementitems: [1,2],
    additionalnode: ''
    //customer: 2
}, {
    id: 4,
    type: 'BL',
    name: 'kid',
    measurementitems: [1,2],
    additionalnode: ''
    //customer: 2
}];

App.Measurementitem.FIXTURES = [{}];