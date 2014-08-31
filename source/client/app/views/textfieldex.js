App.TextFieldEx = Em.TextField.extend({
    focusOut: function () {
        this.sendAction('targetAction', this.get('value'));
    }
});