const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, "./src/cloudfunctions"),
          to: path.join(__dirname, "./dist/dev/mp-weixin", "cloudfunctions"),
        },
      ]),
    ],
  },
};
