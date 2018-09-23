module.exports = function(grunt) {
  grunt.initConfig({
    copydeps: {            
      target: {            
        pkg: 'package.json',
        dest: 'public/quixenboard/deps'
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: './public'
        }
      }
    },
    watch: {}
  });
  grunt.loadNpmTasks('grunt-copy-deps');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['copydeps', 'connect', 'watch']);
}
