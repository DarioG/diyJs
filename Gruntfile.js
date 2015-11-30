module.exports = function (grunt) {

    grunt.initConfig({
        jsdoc : {
            dist : {
                src: ['diy/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'diy/**/*.js',
                'specs/**/*.js'
            ]
        },

        jscs: {
            all: [
                'diy/**/*.js',
                'specs/**/*.js'
            ],
            options: {
                config: '.jscs.json'
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('qa', [
        'jshint',
        'jscs'
    ]);
};
