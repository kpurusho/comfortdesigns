App.Task = DS.Model.extend({
    seqid: DS.attr('number'),
    taskname: DS.attr('string')
});



App.Task.FIXTURES = [
 {
     id: 1,
     seqid: 1,
     taskname: 't1'
 },
 {
     id: 2,
     seqid: 2,
     taskname: 't2'
 },
 {
     id: 3,
     seqid: 3,
     taskname: 't3'
 }
];

