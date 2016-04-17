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
      source: ['./source/client/js/**/*.js', 'temp/*.js'],
      exclude: './source/client/browserify.js',
      dependency: {
        source: './source/client/browserify.js',
        destination: 'dependency.min.js'
      }
    },
    server: {
      source: './source/server/**/*.js',
      exclude: ''
    },
    lint_exlude: ['**/3rdparty/**/*.js']
  },

  css: {
    source: './source/client/css/**/*.css',
    generated: 'dist/client/client*.min.css',
    screen: {
      source: [
        //'./bower_components/angular-material/angular-material.css',
        //'./bower_components/bootstrap/dist/css/bootstrap.css',
        //'./bower_components/font-awesome/css/font-awesome.css',
        './source/client/css/client-screen.css'
      ],
      destination_name: 'client-screen.min.css'
    },
    lint_exlude: ['./bower_components/angular-material/angular-material.css'],
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

  resources: {
    client: {
      source: ['./source/client/favicon.ico','./source/client/images/*.jpg']
    },
    server: {
      source: ['./source/server/*.json', './database/datasets/*.json']
    }
  },

  images: {
    source: './source/client/images/**/*.png'
  },

  destination: {
    base_dir: 'dist/',
    all: ['dist/client/**/*','dist/server/**/*','temp/*.js'],
    server: {
      base_dir: 'dist/server/',
      js: ['dist/server/**/*.js', 'dist/server/**/*.map','temp/*.js'],
    },
    client: {
      base_dir: 'dist/client/',
      js: ['dist/client/**/*.js','temp/*.js','dist/client/**/*.map'],
      scripts: ['dist/client/client*.js','temp/*.js','dist/client/client*.map'],
      dependency: ['dist/client/dependency*.js','dist/client/dependency*.map'],
      css: 'dist/client/**/*.css'
    }
  }
};