import path from 'path';
import { Configuration } from 'webpack';

interface EnvVariables {
  mode: 'production' | 'development';
}

export default (env: EnvVariables) => {
  const config: Configuration = {
    target: 'node',
    mode: env.mode ?? 'development',
    entry: {
      ws: path.resolve(__dirname, 'src', 'ws_server', 'index.ts'),
      http: path.resolve(__dirname, 'src', 'http_server', 'index.ts'),
    },
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
    externals: {
      bufferutil: 'bufferutil',
      'utf-8-validate': 'utf-8-validate',
    },
  };

  return config;
};
