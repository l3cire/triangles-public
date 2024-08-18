import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import type webpack from 'webpack';
import { type BuildOptions } from './types/config';

export const buildMinimizer = (options: BuildOptions): webpack.WebpackPluginInstance[] => {
    return [
        // @ts-expect-error webpack allows to use `...` to extend existing minimizers
        // eslint-disable-next-line
        `...`,
        new CssMinimizerPlugin(),
    ];
};
