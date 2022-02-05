const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const filename = (ext) => `[name].${ext}`;

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: "./ts/index.ts",
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: `./js/${filename("js")}`,
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    clean: true,
  },
  optimization: {
    minimize: isProd,
  },
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 3001,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      filename: "index.html",
      favicon: path.resolve(__dirname, "src/favicon.ico"),
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new MiniCssExtractPlugin({
      filename: `./css/${filename("css")}`,
    }),
    new ESLintPlugin({
      extensions: ["ts"],
    }),
  ],
  devtool: isProd ? false : "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        },
      },
      {
        test: /\.(mp4)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/video/[name][ext]",
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "[path][name][ext]",
        },
      },
      {
        test: /\.(webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "[path][name][ext]",
        },
      },
      {
        test: /\.(svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "[path][name][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext]",
        },
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
};
