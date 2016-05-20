const webpack = require('webpack');
const path = require('path');

const PATHS = {
    rootDir: __dirname,
    appDir: path.join(__dirname, '/app'),
    appJsFile: path.join(__dirname, '/app', './index.js'),
    outDir: path.join(__dirname, '/public'),
    outAppFile: 'app-bundle.js'
};

module.exports = {
    context: PATHS.rootDir,

    entry: PATHS.appJsFile,

    output: {
        path: PATHS.outDir,
        filename: PATHS.outAppFile
    },

    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', include: [ PATHS.appDir ] },
            { test: /\.html$/, loader: 'raw', include: [ PATHS.appDir ] },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(jpg|png)$/, loader: 'file'  },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
            { test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],

    devServer: {
        contentBase: PATHS.outDir,
        noInfo: false,
        hot: false
    },

    // support source maps
    devtool: "#inline-source-map"
};