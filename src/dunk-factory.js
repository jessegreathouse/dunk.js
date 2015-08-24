/**
 * dunk-factory.js
 * Package: dunk.js
 * Created: 8/21/15
 * Authors: jgreathouse
 */
var Dunk = require('./dunk');

/**
 * Dunk factory function
 * @param config
 * @returns {Dunk|exports|module.exports}
 */
module.exports = function (config) {
    return new Dunk(config);
};