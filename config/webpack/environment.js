const { environment } = require('@rails/webpacker')
const typescript =  require('./loaders/typescript')
const modernizr_config = require('./modernizr_config')

environment.config.merge(modernizr_config)
environment.loaders.prepend('typescript', typescript)
environment.config.merge({
  stats: 'none',
});

module.exports = environment;