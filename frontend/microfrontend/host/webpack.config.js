const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const deps = require('./package.json').dependencies

module.exports = {
    entry: './src/index.js',
    cache: false,
    devServer: {
        static: path.join(__dirname, 'public'),
        port: 3000,
        hot: true,
        historyApiFallback: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
    },
    mode: 'development',
    devtool: 'source-map',
    optimization: {
        minimize: false,
        runtimeChunk: false,
    },
    output: {
        uniqueName: 'host',
        publicPath: 'http://localhost:3000/',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                auto: /\.module\.css$/,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                },
            },

        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false,
        }),
        new ModuleFederationPlugin({
            name: 'frontend',
            filename: 'remoteEntry.js',
            remotes: {
                authMicrofrontend: 'authMicrofrontend@http://localhost:3001/remoteEntry.js',
                photosMicrofrontend: 'photosMicrofrontend@http://localhost:3002/remoteEntry.js',
                profileMicrofrontend: 'profileMicrofrontend@http://localhost:3003/remoteEntry.js',
            },
            exposes: {
                './Header': './src/components/Header.js',
                './Footer': './src/components/Footer.js',
                './PopupWithForm': './src/components/PopupWithForm.js',
                './ApiUtils': './src/utils/api.js',
            },
            shared: {
                ...deps,
                'react-router-dom': {
                    singleton: true,
                    eager: true
                },
                'react-dom': {
                    singleton: true,
                    eager: true
                },
                react: {
                    singleton: true,
                    eager: true
                },
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            minify: false,
        }),
    ],
};