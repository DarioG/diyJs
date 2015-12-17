module.exports = function (grunt) {

    grunt.initConfig({
        markdown: {
            all: {
                files: [{
                    expand: true,
                    src: ['README.md'],
                    dest: 'markdown/',
                    ext: '.html'
                }]
            }
        },

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
    grunt.loadNpmTasks('grunt-markdown');

    grunt.registerTask('mark', ['markdown']);
    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('qa', [
        'jshint',
        'jscs'
    ]);
};
