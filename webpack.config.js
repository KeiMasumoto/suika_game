const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    devServer: {
        static: "dist",
        open: true
    },
    entry: './src/game.js',
    output: {
        path: path.resolve(__dirname, 'dist/'),
        publicPath: './',
        filename: 'index.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            // 抽出する CSS のファイル名
            filename: 'style.css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            // {
            //     test: /\.css/,
            //     use: [
            //       "style-loader",
            //       {
            //         loader: "css-loader",
            //         options: { url: false }
            //       }
            //     ]
            // },
            {
                test: /\.(jpg|png|mp3)$/,
                use: [
                    'url-loader'
                ]
            },
            {
                //拡張子 .scss、.sass、css を対象
                test: /\.(scss|sass|css)$/i,
                // 使用するローダーの指定（後ろから順番に適用される）
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ],
            },
        ],
    },
    optimization: {
        minimize: false,
    },
    devtool: "source-map",
    target: ["web", "es6"],
};