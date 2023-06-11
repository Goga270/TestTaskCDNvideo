const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');


const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../docs'),
    assets: 'assets/',
}

module.exports = {

    externals: {
        paths: PATHS
    },

    entry: {
        app: PATHS.src + '/main.js'
    },

    output: {
        filename: `${PATHS.assets}js/[name].js`,
        path: PATHS.dist,
        publicPath: '/docs'
    },
    module: {
        rules: [
            // JS
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: '/node_modules/'
            },
            // VUE
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loader: {
                        scss: 'vue-style-loader!css-loader!sass-loader'
                    }
                }
            },
            // CSS
            {
                test:  /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {sourceMap: true}
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                config: `${PATHS.src}/js/postcss.config.js`
                            }
                        }
                    },
                ]
            },
            // SCSS
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {sourceMap: true}
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                config: `${PATHS.src}/js/postcss.config.js`
                            }
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {sourceMap: true}
                    }
                ]
            },
            // Images / Icons
            {
                test: /\.(png|jpg|giv|svg|webp)$/,
                loader: "file-loader",
                options: {
                    name: '[name].[ext]',
                    outputPath: `${PATHS.assets}/img`,
                }
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].css`
        }),
        new copyWebpackPlugin({
            patterns: [
                // Images
                {
                    from: `${PATHS.src}/${PATHS.assets}/img`,
                    to: `${PATHS.assets}/img`
                },
                // Fonts
                /*{
                    from: `${PATHS.src}/${PATHS.assets}fonts`,
                    to: `${PATHS.assets}fonts`
                },*/
                // Static
                {
                    from: `${PATHS.src}/static`,
                    to: ''
                }
            ]
        }),
        new htmlWebpackPlugin({
            hash: true,
            template: `${PATHS.src}/index.html`,
            filename: "./index.html"
        }),
        new VueLoaderPlugin(),
    ],
    resolve: {
        alias: {
            '@': PATHS.src,
        },
    },
}