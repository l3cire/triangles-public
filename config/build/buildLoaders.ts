import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type webpack from 'webpack';

export const buildLoaders = (): webpack.RuleSetRule[] => {
    const typescriptLoader = {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
    };

    const cssLoader = {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
    };

    const svgLoader = {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
    };

    const fileLoader = {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            },
        ],
    };

    return [typescriptLoader, cssLoader, svgLoader, fileLoader];
};
