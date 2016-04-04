module.exports = {
  conf: {
    source: ['./gulp/*.conf.js'],
    lint_exlude: ''
  },

  test: {
    unit: {
      source: './source/test/unit/**/*.spec.js',
      lint_exlude: ''
    },
    e2e: {
      source: './source/test/e2e/**/*.spec.js',
      lint_exlude: ''
    }
  },

  gulp: {
    source: ['gulpfile.js', './gulp/tasks/**/*.js'],
    lint_exlude: ''
  },

  node: {
    main: './source/server/main.js',
    source: './source/server/**/*.js',
    lint_exlude: '',
    config: '',
    exec: ''
  },

  js: {
    source: ['./source/server/**/*.js', './source/client/js/**/*.js'],
    lint_exlude: ''
  },

  css: {
    source: '',
    lint_exlude: ''
  },

  html: {
    source: ['./source/client/**/*.html'],
    lint_exlude: ''
  },

  images: {
    source: '',
    lint_exlude: ''
  },

  destination: {
    folder: ''
  }
};