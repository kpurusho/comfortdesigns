module.exports = {
    options: {
        banner: '/*! <%= grunt.template.today("dd/mm/yyyy") %>*/\n'
    },
    dist: {
        files: {
            'dist/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>']
        }
    }
}