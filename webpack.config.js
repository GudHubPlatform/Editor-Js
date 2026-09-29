import webpack from "webpack";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";

export default {
    experiments: {
        outputModule: true,
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    entry: {
        main: './src/entry.js',
    },
    output: {
        filename: '[name].js',
        library: {
            type: 'module'
        }
    },
    module: {
        rules: [
            {
                test: /\.(sass|scss|css)$/,
                use: [
                    // Injects <style> into <head> at the moment the CSS module
                    // is evaluated (see lazy import in entry.js), no separate .css file.
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: false,
                            modules: false,
                        },
                    },
                    'sass-loader',
                ],
            }
        ]
    },
    plugins: [
        // main.js is loaded from a data: URL, so relative chunk URLs can't
        // be resolved. Force a single output file.
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin()
        ]
    }
};
