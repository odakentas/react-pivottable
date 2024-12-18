module.exports = {
  devServer: {
    hot: true,
    static: './examples'
  },
  devtool: 'source-map',
  mode: 'development',
  entry: [
    './examples/index.jsx'
  ],
  output: {
    filename: 'bundle.js'
  },
  module : {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
