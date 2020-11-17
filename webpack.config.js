'use strict';

const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

// config
const minimizeInDev = false;

module.exports = (env, args) => {

    let isDevBuild = false;
    if (process.env.NODE_ENV !== "production") {
        isDevBuild = true;
    }

    let plugins = [
        new CleanWebpackPlugin()
    ];

    return [{
        entry: {
            app: path.resolve(__dirname + '/app.js')
        },
        output: {
            publicPath: "/build/",
            path: path.join(__dirname, '/build/'),
            filename: '[name].js'
        },
        devtool: isDevBuild ? 'eval' : '',
        target: "node",
        externals: [nodeExternals()],
        mode: isDevBuild ? "development" : "production",
        optimization: {
            minimize: !isDevBuild || minimizeInDev,
            minimizer: [
                // https://github.com/terser/terser
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false,
                    terserOptions: {
                        warnings: false,
                        parse: {},
                        compress: {
                            //// Replace arguments[index] with function parameter name whenever possible
                            arguments: true,
                            //// Turn booleans into 0 and 1, also makes comparisons with booleans use == and != instead of === and !==
                            booleans_as_integers: false,
                            //// Pass true to discard calls to console.* functions
                            drop_console: !isDevBuild,
                            //// Pass true to prevent the compressor from discarding class names
                            keep_classnames: isDevBuild,
                            //// Pass true to prevent the compressor from discarding function names
                            keep_fnames: isDevBuild
                        },
                        format: {
                            ecma: 6
                        },
                        mangle: {
                            //// Pass true to mangle names visible in scopes where eval or with are used
                            eval: !isDevBuild,
                            //// Pass true to not mangle class names
                            keep_classnames: isDevBuild,
                            //// Pass true to not mangle function names
                            keep_fnames: isDevBuild,
                            //// Pass true to work around the Safari 10 loop iterator bug "Cannot declare a let variable twice"
                            safari10: true,
                        },
                        module: false,
                        output: {
                            beautify: isDevBuild,
                            comments: isDevBuild
                        },
                        toplevel: false,
                        nameCache: null,
                        ie8: false,
                        keep_classnames: isDevBuild,
                        keep_fnames: isDevBuild,
                        safari10: true,
                        ecma: 6
                    },
                })
            ]
        },
        plugins: plugins,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    use: ['source-map-loader']
                },
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        query: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.js'],
            modules: [
                path.resolve(__dirname + '/src'),
                path.resolve(__dirname + '/node_modules')
            ]
        },
        watch: false
    }];
};
