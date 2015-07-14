var path = require('path');
//var webpack = require('webpack');

module.exports = {
    // devtool: '#source-map',
    debug: false,
    output: {
        filename: 'app.js',
        // sourceMapFilename: 'app.js.map',
        publicPath: './public/assets/'
    },
    resolve: {
        modulesDirectories: ['src'],
        root: path.join(__dirname, '/src'),
        extensions: ['', '.js', '.json']
    },
    module: {
        loaders: [
            //{ test: /\.html$/, loader: 'mustache' },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader?experimental&comments=false'
            }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin(),
        // new webpack.optimize.DedupePlugin()
    ]

};
