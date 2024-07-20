const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => ({
  mode: argv.mode === "production" ? "production" : "development",

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === "production" ? false : "inline-source-map",

  entry: {
    ui: "./src/app/index.tsx", // The entry point for your UI code
    code: "./src/plugin/controller.ts", // The entry point for your plugin code
  },

  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },

      // Enables including CSS by doing "import './file.css'" in your TypeScript code
      {
        test: /\.css$/,
        use: ["style-loader", { loader: "css-loader" }],
      },

      // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
      {
        test: /\.(png|jpg|gif|webp|svg)$/,
        loader: "url-loader",
        options: {
          limit: 8192, // In bytes
          name: "[name].[hash:8].[ext]", // Output filename pattern
          outputPath: "assets", // Output directory for assets
          esModule: false, // Handle ES modules correctly
        },
      },
    ],
  },

  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"), // Compile into a folder called "dist"
  },

  // Tells Webpack to generate "ui.html" and to inline "ui.tsx" into it
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/app/index.html", // Use your own HTML template if necessary
      filename: "ui.html", // Output HTML filename
      inlineSource: ".(js)$", // Inline all .js files into the HTML
      chunks: ["ui"], // Specify which chunks to include
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ],
});
