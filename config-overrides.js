const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: [/node_modules\/react-datepicker/], // Ignora mapas de origem do react-datepicker
  })
);