const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { DefinePlugin, HotModuleReplacementPlugin } = require("webpack");

const dev = process.env.NODE_ENV !== "production";

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.join(__dirname, "/public/index.html"),
  filename: "index.html",
  inject: "body",
});

const DefinePluginConfig = new DefinePlugin({
  "process.env.NODE_ENV": JSON.stringify("production"),
});

module.exports = {
  mode: dev ? "development" : "production",
  entry: path.join(__dirname, "src/index.tsx"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  devServer: {
    host: "localhost",
    port: 4000,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    hot: true,
    open: true,
  },
  devtool: dev ? "eval-source-map" : "source-map",
  plugins: dev
    ? [HTMLWebpackPluginConfig, new HotModuleReplacementPlugin()]
    : [HTMLWebpackPluginConfig, DefinePluginConfig, new CleanWebpackPlugin()],
};
