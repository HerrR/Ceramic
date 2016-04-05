module.exports = {
  conf: {
    source: ['./gulp/*.conf.js'],
    lint_exlude: ''
  },

  test: {
    unit: {
      source: './source/test/unit/**/*.spec.js',
      karma: __dirname + '/karma.conf.js',
      lint_exlude: ''
    },
    e2e: {
      source: './source/test/e2e/**/*.spec.js',
      protractor: 'gulp/protractor.conf.js',
      url:'',
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
    client: {
      source: './source/client/js/**/*.js',
      exclude: './source/client/js/browserify.js',
      dependency: {
        source: './source/client/js/browserify.js',
        destination: 'dependency.min.js'
      }
    },
    server: {
      source: './source/server/**/*.js',
      exclude: ''
    },
    lint_exlude: ''
  },

  css: {
    source: './source/client/css/**/*.css',
    screen: {
      source: './source/client/css/cvc-screen.css',
      destination_name: 'cvc-screen.min.css'
    },
    print: {
      source: './source/client/css/cvc-print.css',
      destination_name: 'cvc-print.min.css'
    },
    lint_exlude: '',
    compatibility: 'ie8'
  },

  html: {
    source: './source/client/**/*.html',
    lint_exlude: '',
    main: './source/client/index.html',
    inject: ['dependency*.min.js', 'cvc*.min.js', 'cvc*.min.css']
    angular: {
      source: './source/client/partials/**/*.html'
      module_name: 'cvc',
      prefix: 'partials/',
      destination_dir: 'temp'
    }
  },

  images: {
    source: '',
    lint_exlude: ''
  },

  destination: {
    base_dir: 'dist/',
    server: {
      base_dir: 'dist/server/',
      js: 'dist/server/**/*.js',
    },
    client: {
      base_dir: 'dist/client/',
      js: 'dist/client/**/*.js',
      css: 'dist/client/**/*.css'
    }
  }
};