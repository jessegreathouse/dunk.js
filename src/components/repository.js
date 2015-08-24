/**
 * repository
 * Package: test.js
 * Created: 8/21/15
 * Authors: jgreathouse
 */

function Repository() {
    'use strict';
    var count = 0;
    var collection = {};
    var indexes = {};

    /**
     * changeHandler
     * @param changes
     */
    var changeHandler = function(changes) {
        for (var i = 0; i < changes.length; i++) {
            var change = changes[i];
            var object = change.object;
            console.log(change);
            switch(change.type) {
                case 'update':
                    deleteIndex(change.name, change.oldValue, object._id);
                    persist(object);
                    break;
                case 'delete':
                    deleteAllIndexes(object._id);
                    break;
                default:
                    console.log('unhandled event:' + change.type);
            }
        }
    };

    /**
     * initCollection
     * @param c
     * @returns {*}
     */
    var initCollection = function(c) {
        for (var i in c) {
            if (c.hasOwnProperty(i)) {
                Object.observe(c[i], changeHandler);
            }
        }
        return c;
    };

    /**
     * intersect
     * @param a
     * @param b
     * @returns {Array}
     */
    var intersect = function(a, b) {
        var ai=0, bi=0;
        var result = [];

        while( ai < a.length && bi < b.length )
        {
            if      (a[ai] < b[bi] ){ ai++; }
            else if (a[ai] > b[bi] ){ bi++; }
            else /* they're equal */
            {
                result.push(a[ai]);
                ai++;
                bi++;
            }
        }

        return result;
    };

    /**
     * persist
     * @param object
     * @returns {*}
     */
    var persist = function (object) {
        if ('undefined' === typeof object._id) {
            count++;
            object._id = count;
        }

        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                setIndex(key, object[key], object._id);
                //noinspection JSCheckFunctionSignatures
                Object.observe(object, changeHandler);
            }
        }

        return collection[object._id] = object;
    };

    /**
     * setIndex
     * @param key
     * @param value
     * @param id
     */
    var setIndex = function (key, value, id) {
        //create index if not already exists
        createIndex(key, value);
        indexes[key][value].push(id);
    };

    var getIndex = function (key) {
        if ('undefined' === typeof indexes[key]) {
            indexes[key] = [];
        }

        return indexes[key];
    };

    /**
     * deleteIndex
     * @param key
     * @param value
     * @param id
     */
    var deleteIndex = function (key, value, id) {
        var i = indexes[key][value].indexOf(id);
        console.log(i);
        if (i > -1) {
            indexes[key][value].splice(i, 1);
        }
    };

    /**
     * deleteAllIndexes
     * @param id
     */
    var deleteAllIndexes = function (id) {
        for (var key in indexes) {
            if (indexes.hasOwnProperty(key)) {
                for (var value in indexes[key]) {
                    if (indexes[key].hasOwnProperty(value)) {
                        deleteIndex(key, value, id);
                    }
                }
            }
        }
    };

    /**
     * createIndex
     * @param key
     * @param value
     */
    var createIndex = function(key, value) {
        if ('undefined' === typeof indexes[key]) {
            indexes[key] = {};
        }

        if ('undefined' === typeof indexes[key][value]) {
            indexes[key][value] = [];
        }
    };

    /**
     * assembleCollectionToList
     * @param list
     * @returns {Array}
     */
    var assembleCollectionToList = function(list) {
        var result = [];
        for (var i=0; i < list.length; i++) {
            result.push(collection[list[i]]);
        }
        return result;
    };

    /**
     * public findBy
     * @param params
     * @returns {Array}
     */
    this.findBy = function(params) {
        var list = [];
        var empty_list = true;
        for (var param in params) {
            if (params.hasOwnProperty(param)) {
                var index = getIndex(param);
                if ('undefined' !== typeof index[params[param]]) {
                    if (empty_list === true) {
                        list = index[params[param]];
                    } else {
                        list = intersect(list, index[params[param]]);
                    }
                    empty_list = false;
                }
            }
        }
        return assembleCollectionToList(list);
    };

    /**
     * public findOneBy
     * @param params
     * @returns {*}
     */
    this.findOneBy = function(params) {
        var list = this.findBy(params);
        if (list.length) {
            return list[0];
        } else {
            return undefined;
        }
    };

    /**
     * public persist
     */
    this.persist = function (object) {
        return persist(object);
    };

    /**
     * public getCollection
     * @returns {{}}
     */
    this.getCollection = function() {
        return collection;
    };

    /**
     * public setCollection
     * @param c
     */
    this.setCollection = function(c) {
        collection = initCollection(c);
        count = Object.keys(collection).length;
        console.log('init count:' + count);
    };

    /**
     * public getIndexes
     * @returns {{}}
     */
    this.getIndexes = function() {
        return indexes;
    };

    /**
     * public setIndexes
     * @param i
     */
    this.setIndexes = function(i) {
        indexes = i;
    };
}

module.exports = Repository;