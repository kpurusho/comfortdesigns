App.Customer = DS.Model.extend({
    name: DS.attr('string'),
    phoneno: DS.attr('string'),
    emailid: DS.attr('string'),
    addressline1: DS.attr('string'),
    addressline2: DS.attr('string'),
    addressline3: DS.attr('string'),
    measurements: DS.hasMany('measurement', { async: true })
});

App.Customer.FIXTURES = [{
    id: 1,
    name: 'lavanya',
    phoneno: '9500037396',
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
