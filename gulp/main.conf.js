module.exports = {
  test: {
    unit: {
      source: '../test/unit/**/*.spec.js'
    },
    e2e: {
      source: '../test/e2e/**/*.spec.js'
    }
  },test: {
    unit: {
      source: '../test/unit/**/*.spec.js'
    },
    e2e: {
      source: '../test/e2e/**/*.spec.js'
    }
  },

  gulp: {
    source: ['gulpfile.js', 'tasks/**/*.js']
  },

  node: {
    main: '../source/server/main.js',
    source: '../source/server/**/*.js',
    config: ''
    exec: ''
  },

  js: {
    source: ['../source/server/**/*.js', '../source/client/js/**/*.js']
  },

  css: {
    source: ''
  },

  html: {
    source: ''
  },

  images: {
    source: ''
  },

  destination: {
    folder: ''
  }
};