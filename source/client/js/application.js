App = Ember.Application.create({ LOG_TRANSITIONS: true });

App.ApplicationAdapter = DS.FixtureAdapter.extend();

//App.ApplicationAdapter = DS.RESTAdapter.extend({
//    host: 'http://localhost:3000'
//});

//App.Serializer = DS.RESTSerializer.extend({
//    normalize: function (type, hash, property) {

//        // normalize the `_id`
//        var json = { id: hash._id };
//        delete hash._id;

//        // normalize the underscored properties
//        for (var prop in hash) {
//            json[prop.camelize()] = hash[prop];
//        }

//        // delegate to any type-specific normalizations
//        return this._super(type, json, property);
//    }
//});

//App.TaskSerializer = App.Serializer.extend();
//App.CustomerSerializer = App.Serializer.extend();