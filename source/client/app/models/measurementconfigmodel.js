/**
 * Created by Karthik on 4/9/2014.
 */
App.Measurementconfig = DS.Model.extend({
    type: DS.attr('string'),
    measurementitems: DS.hasMany('measurementitemconfig', { async: true })
});

App.Measurementitemconfig = DS.Model.extend({
    itemname : DS.attr('string'),
    min : DS.attr('number'),
    max: DS.attr('number')
});

App.Measurementconfig.FIXTURES = [{
    id: 1,
    type: 'SK',
    measurementitems: [1,2]
    //customer: 1
}];

App.Measurementitemconfig.FIXTURES = [{
    id: 1,
    itemname: 'length',
    min: 0,
    max: 100
    //customer: 1
}, {
    id: 2,
    itemname: 'slit',
    min: 0,
    max: 100
}
];
