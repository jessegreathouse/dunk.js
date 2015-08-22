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

    var setIndex = function (key, id) {
        if ('undefined' === typeof indexes[key]) {
            indexes[key] = [];
        }

        indexes[key].push(id);
    };

    var getIndex = function (key) {
        if ('undefined' === typeof indexes[key]) {
            indexes[key] = [];
        }

        return indexes[key];
    };

    this.save = function (object) {
        if ('undefined' === typeof object.prototype._id) {
            count++;
            object.prototype._id = this.count;
        }

        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                setIndex(key, object.prototype._id);
                object.watch(key, function () {
                    //noinspection JSReferencingMutableVariableFromClosure
                    setIndex(key, object.prototype._id);
                });
            }
        }

        object.watch();

        return collection[object.prototype._id] = object;
    }
}

module.exports = Repository;