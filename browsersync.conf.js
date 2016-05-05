// browser-sync start --proxy 'https://localhost:9010' --no-online --files './dist/client/*' --https --config=browsersync.conf.js

module.exports = {
    notify: false,
    ghostMode: false,
    notify: false,
    reloadDelay: 2000,
    watchOptions: {
        debounceDelay: 2000
    }
};