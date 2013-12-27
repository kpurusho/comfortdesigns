App.NavView = Ember.View.extend({
    tagName: 'li',
    classNameBindings: ['active'],

    didInsertElement: function () {
          this._super();
          this.notifyPropertyChange('active');
          var _this = this;
          this.get('parentView').on('click', function () {
              _this.notifyPropertyChange('active');
          });
    },

    active: function() {
      return this.get('childViews.firstObject.active');
    }.property()
  });

//App.RestrictedTextField = Ember.TextField.extend({
//    attributeBindings: ['size'],
//    'size': '10'
//});

//Ember.TextField.reopen({
//    attributeBindings: ['size']
//});