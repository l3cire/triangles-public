import type webpack from 'webpack';
import { type BuildOptions } from './types/config';

export const buildResolvers = ({ paths }: BuildOptions): webpack.ResolveOptions => {
    return {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [paths.src, 'node_modules', 'public'],
        mainFiles: ['index'],
        alias: {},
    };
};
