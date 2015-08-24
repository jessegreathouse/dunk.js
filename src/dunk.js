/**
 * dunk
 * Package: test.js
 * Created: 8/21/15
 * Authors: jgreathouse
 */
var fs = require('fs');
var Repository = require('./repository');

/**
 * Dunk
 * @param config
 * @constructor
 */
function Dunk(config) {
    'use strict';

    var repositories = {};

    this.config = {
        appKey: 'DunkDefault'
        , dataCache: '/tmp/Dunk'
    };

    if ('undefined' !== typeof config) for (var key in config) { //noinspection JSUnfilteredForInLoop
        this.config[key] = config[key];
    }

    /**
     * provisionCachePath
     * @param path
     */
    var provisionCachePath = function(path) {
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
    };

    /**
     * cacheFile
     * @param object
     * @param path
     * @param file
     */
    var cacheFile = function(object, path, file) {
        var cacheFile = path + '/' + file + '.repo';
        fs.open(cacheFile, 'w+', null, function (err, fd) {
            if (err) throw err;
            //noinspection JSReferencingMutableVariableFromClosure
            var cacheStr = JSON.stringify(object);
            fs.write(fd, cacheStr, 0, cacheStr.length, null, function(err) {
                if (err) throw err;
            });
        });
    };

    /**
     * getCachedRepositories
     * @param cacheDir
     */
    var getCachedRepositories = function(cacheDir)
    {
        return fs.readdirSync(cacheDir);
    };

    /**
     * initRepositories
     * @param names
     */
    var initRepositories = function(names) {
        for (var i = 0; i < names.length; i++) {
            if ('undefined' === typeof repositories[names[i]]) {
                repositories[names[i]] = new Repository();
            }
        }
    };

    provisionCachePath(this.config.dataCache);
    provisionCachePath(this.config.dataCache + '/' + this.config.appKey);
    initRepositories(getCachedRepositories(this.config.dataCache + '/' + this.config.appKey));

    for (var name in repositories) {
        if (repositories.hasOwnProperty(name)) {
            var cacheDir = this.config.dataCache + '/' + this.config.appKey + '/' + name;
            if (fs.existsSync(cacheDir + '/collection.repo')){
                var collection = fs.readFileSync(cacheDir + '/collection.repo');
                repositories[name].setCollection(JSON.parse(collection));
            }
            if (fs.existsSync(cacheDir + '/indexes.repo')){
                var indexes = fs.readFileSync(cacheDir + '/indexes.repo');
                repositories[name].setIndexes(JSON.parse(indexes));
            }
        }
    }

    /**
     * public getRepository
     * @param key
     * @returns {*}
     */
    this.getRepository = function (key) {
        if ('undefined' === typeof repositories[key]) {
            repositories[key] = new Repository();
        }

        return repositories[key];
    };

    /**
     * public persist
     * @param object
     * @param key
     */
    this.persist = function (object, key) {
        if ('undefined' === typeof key || null === key) {
            key = object.constructor.name;
        }
        return this.getRepository(key).persist(object);
    };

    /**
     * public flush
     */
    this.flush = function(){
        var path = this.config.dataCache + '/' + this.config.appKey + '/';
        for (var name in repositories) {
            if (repositories.hasOwnProperty(name)) {
                var cacheDir = path + name;
                provisionCachePath(cacheDir);
                cacheFile(repositories[name].getCollection(), cacheDir, 'collection'); //cache collection
                cacheFile(repositories[name].getIndexes(), cacheDir, 'indexes'); //cache indexes
            }
        }
    };
}

module.exports = Dunk;