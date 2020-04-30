const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: {
    app: "./index.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new WebpackPwaManifest({
      name: "Online/Offline Budget Trackers",
      short_name: "Budget Trackers",
      description: "An application that allows the user to add expenses and deposits to a budget without a connection.",
      background_color: "#01579b",
      theme_color: "#ffffff",
      "theme-color": "#ffffff",
      start_url: "/",
      icons: [{
        src: path.resolve("./icons/icon-192x192.png"),
        sizes: [192, 512],
        destination: path.join("public", "icons")
      }]
    })
  ]
};

module.exports = config;
