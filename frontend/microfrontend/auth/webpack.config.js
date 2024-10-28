const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('./package.json').dependencies

module.exports = {
    entry: './src/index.js',
    cache: false,
    devServer: {
        static: path.join(__dirname, 'public'),
        port: 3001,
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
    },
    output: {
        uniqueName: 'auth',
        publicPath: 'auto',
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
                use: ['style-loader', 'css-loader'],
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
        new ModuleFederationPlugin({
            name: 'authMicrofrontend',
            filename: 'remoteEntry.js',
            exposes: {
                './Login': './src/components/Login.js',
                './Register': './src/components/Register.js',
                './InfoTooltip': './src/components/InfoTooltip.js',
                './AuthUtils': './src/utils/auth.js'
            },
            remotes: {
                frontend: 'frontend@http://localhost:3000/remoteEntry.js',
            },
            shared: {
                ...deps,
                'react-router-dom': {
                    singleton: true,
                    requiredVersion: deps['react-router-dom'],
                    eager: true
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: deps['react-dom'],
                    eager: true
                },
                react: {
                    singleton: true,
                    requiredVersion: deps.react,
                    eager: true
                },
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        })
    ]
};