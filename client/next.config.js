//to prevent next.js's inability to detect file changes (hopefully)
module.exports = {
    webpack: (config) => {
      config.watchOptions.poll = 300;
      return config;
    },
};