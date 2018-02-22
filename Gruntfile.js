module.exports = function(grunt) {

  // 1. All configuration goes here
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
            width: 1600,
            suffix: '_large',
            quality: 30
          },
          {
            width: 800,
            suffix: '_medium',
            quality: 30
          },
          {
            width: 400,
            suffix: '_small',
            quality: 30
          }]
        },

        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img_src/',
          dest: 'img/'
        }]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['img'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['img']
        },
      },
    },

  });

  // 3. Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');

  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['clean', 'mkdir', 'responsive_images']);

};
