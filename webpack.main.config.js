const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    main: './src/main/main.ts',
    preload: './src/main/preload.ts'
  },
  target: 'electron-main',
  output: {
    path: path.resolve(__dirname, 'dist/main'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.main.json'
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'MAIN_WINDOW_VITE_DEV_SERVER_URL': JSON.stringify(process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL || ''),
      'MAIN_WINDOW_VITE_NAME': JSON.stringify(process.env.MAIN_WINDOW_VITE_NAME || 'main_window'),
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
}; 