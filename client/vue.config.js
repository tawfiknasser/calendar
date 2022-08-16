const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify',
  ],

  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: true,
    },
  },
});
