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
    main: 'main.js',
    source: './source/server/**/*.js',
    lint_exlude: '',
    config: '',
    exec: ''
  },

  js: {
    source: ['./source/server/**/*.js', './source/client/js/**/*.js'],
    client: {
      generated: {
        js: ['client*.min.js','client*.min.map'],
        dependency: ['dependency*.min.js', 'dependency*.min.map'],
        destination: 'client.min.js'
      },
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
    generated: ['dist/client/client*.min.css'],
    screen: {
      source: './source/client/css/client-screen.css',
      destination_name: 'client-screen.min.css'
    },
    print: {
      source: './source/client/css/client-print.css',
      destination_name: 'client-print.min.css'
    },
    lint_exlude: '',
    compatibility: 'ie8'
  },

  html: {
    source: './source/client/**/*.html',
    lint_exlude: '',
    main: './source/client/index.html',
    inject: ['./dist/client/dependency*.min.js', './dist/client/client*.min.js', './dist/client/client*.min.css'],
    angular: {
      source: './source/client/partials/**/*.html',
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
    all: ['dist/client/**/*','dist/server/**/*'],
    server: {
      base_dir: 'dist/server/',
      js: ['dist/server/**/*.js', 'dist/server/**/*.map'],
    },
    client: {
      base_dir: 'dist/client/',
      js: 'dist/client/**/*.js',
      css: 'dist/client/**/*.css'
    }
  }
};