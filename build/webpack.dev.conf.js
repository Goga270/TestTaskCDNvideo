/*--mode development*/
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    //devtool: 'source-map',
    devServer: {
        port: 8081,
        client: {
            overlay: true,
        },
        static: {
            directory: baseWebpackConfig.externals.paths.dist
        }
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ]
});

module.exports = new Promise((resolve, reject)=>{
    resolve(devWebpackConfig);
});