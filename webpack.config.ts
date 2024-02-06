import path from 'path';
import { Configuration } from 'webpack';

interface EnvVariables {
  mode: 'production' | 'development';
}

export default (env: EnvVariables) => {
  const config: Configuration = {
    target: 'node',
    mode: env.mode ?? 'development',
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true,
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  };

  return config;
};
