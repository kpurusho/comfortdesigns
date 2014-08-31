function config(name) {
    return require('./tasks/' + name + ".js");
}

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: config('concat'),
        jshint: config('jshint'),
        emberTemplates: config('emberTemplates')
    });

    //load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-ember-templates');

    grunt.registerTask('default', ['concat', 'jshint', 'emberTemplates']);
};