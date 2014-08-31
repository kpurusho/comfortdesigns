/**
 * Created by Karthik on 8/30/14.
 */

module.exports = {
    compile: {
        options: {
            templateName: function(sourceFile) {
                return sourceFile.replace(/templates\//,'');
            }

        },
        files: {
            "dist/templates.js": "templates/**/*.hbs"
        }

    }
}