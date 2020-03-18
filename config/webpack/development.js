process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')

environment.config.merge({
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,  // Delay the rebuild after the first change
    poll: 1000              // Check for changes every second
  },
  stats: 'none'
});

module.exports = environment.toWebpackConfig()
