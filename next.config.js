const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
  // Убедитесь, что у вас есть все необходимые настройки для работы с Ant Design и Less
  modifyVars: { '@primary-color': '#1DA57A' }, // Измените цветовую схему по вашему усмотрению
  lessVarsFilePath: './src/styles/variables.less',
  lessVarsFilePathAppendToEndOfContent: false,

  webpack(config) {
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
});