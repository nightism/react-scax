const path = require('path');
const pkg = require('./package.json'); // Load package info

const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, `${pkg.devDir}/index.html`),
    filename: './index.html'
});

module.exports = {
    entry: path.join(__dirname, `${pkg.devDir}/index.tsx`),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [htmlWebpackPlugin],
    resolve: {
        modules: [path.resolve(__dirname, 'src'), "node_modules"],
        extensions: ['.tsx', '.ts', '.js']
    },
    devServer: {
        port: 3001
    }
};