function config(name) {
    return require('./tasks/' + name + ".js");
}

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: config('concat'),
        jshint: config('jshint'),
        emberTemplates: config('emberTemplates'),
        uglify: config('uglify'),
        watch: {
            files: ['templates/**/*.hbs','app/**/*.js'],
            tasks: ['jshint', 'emberTemplates', 'concat']
        }
    });

    //load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-ember-templates');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dist', ['concat', 'jshint', 'emberTemplates', 'uglify']);
    grunt.registerTask('default', ['watch']);
};