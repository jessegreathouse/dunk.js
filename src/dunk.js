/**
 * dunk
 * Package: test.js
 * Created: 8/21/15
 * Authors: jgreathouse
 */

var Repository = require('./components/repository');

function Dunk(config) {
    'use strict';
    this.config = {
        'appKey': 'DunkDefault'
    };

    if ('undefined' !== typeof config) for (var key in config) { //noinspection JSUnfilteredForInLoop
        this.config[key] = config[key];
    }

    this.repositories = {};

    this.getRepository = function (object, key) {
        if ('undefined' === typeof key || null === key) {
            key = typeof object;
            if ('undefined' === typeof this.repositories[key]) {
                this.repositories[key] = new Repository();
            }
        }

        return this.repositories[key];
    };

    this.save = function (object, key) {
        return this.getRepository(object).save(object, key);
    }
}

module.exports = Dunk;