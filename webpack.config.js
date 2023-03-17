const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    output: {
        filename: "index.js",
        path: __dirname + "/dist"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    experiments: {
        topLevelAwait: true
    },

    
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/template.html",
            title: "Schedule builder",
            filename: "index.html"
        }),

        // https://stackoverflow.com/questions/39555511/inline-javascript-and-css-with-webpack
        new InlineChunkHtmlPlugin(
            HtmlWebpackPlugin,
            [/index/]
        ),
    ],
};
