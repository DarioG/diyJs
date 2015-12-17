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
                    destination: 'doc',
                    template : 'node_modules/ink-docstrap/template',
                    configure : 'node_modules/ink-docstrap/template/jsdoc.conf.json'
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
        },

        watch: {
            docs: {
                files: ['diy/*.js'],
                tasks: ['jsdoc']
            },

            qa: {
                files: [
                    'diy/**/*.js',
                    'specs/**/*.js'
                ],
                tasks: [
                    'jshint',
                    'jscs'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('mark', ['markdown']);
    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('dev', ['watch']);
    grunt.registerTask('qa', [
        'jshint',
        'jscs'
    ]);
};
