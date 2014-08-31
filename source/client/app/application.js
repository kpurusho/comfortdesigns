//Ember.Application.reopen({
//    init: function () {
//        this._super();
//        this.loadTemplates();
//    },

//    templates: [],

//    loadTemplates: function () {
//        var app = this;
//        var templates = this.get('templates');
//        app.deferReadiness();

//        var promises = templates.map(function (name) {
//            return Ember.$.get('/templates/' + name + '.hbs').then(function (data) {
//                Ember.TEMPLATES[name] = Ember.Handlebars.compile(data);
//            });
//        });

//        Ember.RSVP.all(promises).then(function () {
//            app.advanceReadiness();
//        });
//    }
//});

App = Ember.Application.create({
    LOG_ACTIVE_GENERATION: true,
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true
    //templates: ['application']

});

////////////////////
////local adapter
//App.ApplicationAdapter = DS.FixtureAdapter.extend();
//DS.JSONSerializer.reopen({
//    serializeHasMany: function (record, json, relationship) {
//        var key = relationship.key;
//
//        var relationshipType = DS.RelationshipChange.determineRelationshipType(
//                record.constructor, relationship);
//
//        if (relationshipType === 'manyToNone'
//                || relationshipType === 'manyToMany'
//                || relationshipType === 'manyToOne') {
//            json[key] = Ember.get(record, key).mapBy('id');
//            // TODO support for polymorphic manyToNone and manyToMany
//            // relationships
//        }
//    }
//});

//REST adapter
App.ApplicationAdapter = DS.RESTAdapter.extend({
    host: 'http://localhost:3000'
});

Ember.EasyForm.Config.registerInputType('mydate', App.DatePicker);

App.Serializer = DS.RESTSerializer.extend({
    normalize: function (type, hash, property) {

        // normalize the `_id`
        var json = { id: hash._id };
        delete hash._id;

        // normalize the underscored properties
        for (var prop in hash) {
            json[prop.camelize()] = hash[prop];
        }

        // delegate to any type-specific normalizations
        return this._super(type, json, property);
    },

    extractArray: function(store, type, payload, id, requestType) {


        return this._super(store, type, payload, id, requestType);
    },

    serializeHasMany: function(record, json, relationship) {
        var key = relationship.key;

        var relationshipType = DS.RelationshipChange.determineRelationshipType(record.constructor, relationship);

        if (relationshipType === 'manyToNone' || relationshipType === 'manyToMany' || relationshipType === 'manyToOne') {
            json[key] = Ember.get(record, key).mapBy('id');
        }

}
});

App.TaskSerializer = App.Serializer.extend();
App.CustomerSerializer = App.Serializer.extend();
App.MeasurementSerializer = App.Serializer.extend();
App.OrderSerializer = App.Serializer.extend();
App.OrdersummarySerializer = App.Serializer.extend();
App.MeasurementconfigSerializer = App.Serializer.extend();
App.MeasurementitemconfigSerializer = App.Serializer.extend();
App.MeasurementitemSerializer = App.Serializer.extend();

App.Consts = {
    OrderState: {
        New: "New",
        InProgress: "InProgress", 
        Done: "Done",
        Delivered: "Delivered"
    },

    MeasurementType: {
        Blouse: "Blouse",
        Salwar: "Salwar",
        Skirt: "Skirt"
    }
};

