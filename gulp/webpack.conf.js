var glob = require("glob");

module.exports = {

    entry: glob.sync("./source/client/js/**/*.js"),
    output: {
        path: __dirname,
        filename: "bundle.js"
    }/*,
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }*/
};