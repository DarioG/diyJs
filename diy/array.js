/**
* Singleton
* @class DIY.Array
*/
DIY.define('DIY.Array', {
    singleton: true
}, function () {
    var isIterable = function (collection) {
            var length = collection.length;

            return length === 0 || !!collection.length;
        },

    isIterableOrThrowError = function (collection) {
        if (!isIterable(collection)) {
            throw 'Wrong collections passed in. ' +
                'Please if you want to iterate through an object, ' +
                'please use GP.utils.Object.forEach';
        }
    },

    nativeForEach = function (collection, callback, scope) {
        isIterableOrThrowError(collection);

        Array.prototype.forEach.call(collection, function (value, key) {
            callback.call(scope, value, key, collection);
        });
    },

    forEach = function (collection, callback, scope) {
        var length,
            i;

        isIterableOrThrowError(collection);

        length = collection.length;

        for (i = 0; i < length; i++) {
            callback.call(scope, collection[i], i, collection);
        }
    };

    /**
    * @param {Array|HTMLCollections} collection
    * @param {DIY.Array~callback} callback
    * @param {Object} scope
    * @memberof DIY.Array
    */
    this.forEach = function (collection, callback, scope) {
        if (Array.prototype.forEach) {
            this.forEach = nativeForEach;
        } else {
            this.forEach = forEach;
        }

        this.forEach(collection, callback, scope);
    };
});
/**
 * @callback DIY.Array~callback
 * @param {Whatever} currentValue
 * @param {Number} index
 * @param {Array} array
 */
