App = Ember.Application.create({
    LOG_ACTIVE_GENERATION: true,
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true
});

////////////////////
//local adapter
//App.ApplicationAdapter = DS.FixtureAdapter.extend();
//DS.JSONSerializer.reopen({
//    serializeHasMany: function (record, json, relationship) {
//        var key = relationship.key;

//        var relationshipType = DS.RelationshipChange.determineRelationshipType(
//                record.constructor, relationship);

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


