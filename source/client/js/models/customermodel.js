App.Customer = DS.Model.extend({
    name: DS.attr('string'),
    phoneno: DS.attr('string'),
    emailid: DS.attr('string'),
    addressline1: DS.attr('string'),
    addressline2: DS.attr('string'),
    addressline3: DS.attr('string'),
    measurements: DS.hasMany('measurement', { async: true })
});

//App.store.adapter.serializer.map('App.Customer', {
//    measurements: { embedded: 'load' }
//});

App.Measurement = DS.Model.extend({
    type: DS.attr('string'),
    name: DS.attr('string'),
    //length: DS.attr('number'),
    //shoulder: DS.attr('number'),
    //shouldercut: DS.attr('number'),
    //chest: DS.attr('number'),
    //chestmnt: DS.attr('number'),
    //chestfinishedmnt: DS.attr('number'),
    //waist: DS.attr('number'),
    //bb: DS.attr('number'),
    //backneck: DS.attr('number'),
    //frontneck: DS.attr('number'),
    //sllength: DS.attr('number'),
    //slcircum1: DS.attr('number'),
    //slcircum2: DS.attr('number'),
    //arm: DS.attr('number'),
    //armcut: DS.attr('number'),
    //armslant: DS.attr('number'),
    //bl: DS.attr('number'),
    //blsplit: DS.attr('number'),
    //lc: DS.attr('number'),
    //seat: DS.attr('number'),
    //wb: DS.attr('number'),
    //seatlength: DS.attr('number'),
    //topsflair: DS.attr('number'),
    //slitfrom: DS.attr('number'),
    //bottomflair: DS.attr('number'),
    //gatheringw1: DS.attr('number'),
    //gatheringw2: DS.attr('number'),
    //gatheringw3: DS.attr('number'),
    //gatheringl1: DS.attr('number'),
    //gatheringl2: DS.attr('number'),
    customer: DS.belongsTo('customer', { async: true })
});


App.Customer.FIXTURES = [{
    id: 1,
    name: 'lavanya',
    phoneno: '95000373796',
    emailid: 'lavrajan@gmail.com',
    addressline1: '',
    addressline2: '',
    addressline3: '',
    measurements: [1,2]
}, {
    id: 2,
    name: 'ahana',
    phoneno: '96000373796',
    emailid: 'rajan@gmail.com',
    addressline1: '',
    addressline2: '',
    addressline3: '',
    measurements: [3,4]
}];

App.Measurement.FIXTURES = [{
    id: 1,
    type: 'SK',
    name: 'main',
    customer: 1
}, {
    id: 2,
    type: 'BL',
    name: 'main',
    customer: 1
}, {
    id: 3,
    type: 'SK',
    name: 'kid',
    customer: 2
}, {
    id: 4,
    type: 'BL',
    name: 'kid',
    customer: 2
}];