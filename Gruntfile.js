module.exports = function(grunt) {

  grunt.initConfig({
    jsdoc : {
        dist : {
            src: ['diy/*.js'],
            options: {
                destination: 'doc'
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['jsdoc']);

};