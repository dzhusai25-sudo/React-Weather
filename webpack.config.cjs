const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
const REPO_NAME = "React-Weather";
const BASE_URL = `https://dzhusai25-sudo.github.io/${REPO_NAME}/`;
const PREFIX = isProduction ? BASE_URL : "/";

module.exports = {
  entry: "./src/index.tsx",
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: PREFIX,
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 8000,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: './public/index.html',
      publicPath: PREFIX,
    }),
    new HtmlWebpackPlugin({
      filename: "404.html",
      template: './public/index.html',
      publicPath: PREFIX,
    }),
    new webpack.DefinePlugin({
      PRODUCTION: isProduction,
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      PREFIX: JSON.stringify(PREFIX),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
