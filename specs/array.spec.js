/*jshint freeze: false */

describe('DIY.Array', function () {
    var backup,
        arrayInstance;

    beforeEach(function () {
        arrayInstance = new DIY.Array();

        backup = arrayInstance.forEach;
    });

    afterEach(function () {
        arrayInstance.forEach = backup;
    });

    it('should be singleton', function () {
        expect(arrayInstance).toBe(new DIY.Array());
    });

    describe('forEach(array, callback, scope)', function () {

        var array,
            callback,
            scope,

            spyForEach = function () {
                if (Array.prototype.forEach) {
                    spyOn(Array.prototype, 'forEach');
                } else {
                    Array.prototype.forEach = jasmine.createSpy();
                }
            },
            nativeForEachBackup;

        beforeEach(function () {
            nativeForEachBackup = Array.prototype.forEach;
            array = [1, 2, 3];
            callback = jasmine.createSpy();
            scope = {};
        });

        afterEach(function () {
            Array.prototype.forEach = nativeForEachBackup;
        });

        describe('if a native forEach is supported', function () {

            beforeEach(function () {
                spyForEach();
            });

            describe('when a non iterable is passed in', function () {

                it('should throw an exception', function () {
                    var errorMsg = 'Wrong collections passed in. ' +
                    'Please if you want to iterate through an object, ' +
                    'please use GP.utils.Object.forEach';

                    expect(function () {
                        arrayInstance.forEach(500, callback, scope);
                    }).toThrow(errorMsg);
                });

                describe('if a empty array is passed in', function () {

                    it('should not throw', function () {
                        expect(function () {
                            arrayInstance.forEach([], callback, scope);
                        }).not.toThrow();
                    });
                });
            });

            describe('otherwise', function () {

                var iterateThroughTheArray = function (array, iteraction) {
                        var callback = Array.prototype.forEach.calls.mostRecent().args[0];

                        callback(array[iteraction], iteraction, array);
                    };

                beforeEach(function () {
                    arrayInstance.forEach(array, callback, scope);
                });

                it('should be called with the array as scope', function () {
                    expect(Array.prototype.forEach).toHaveBeenCalledWithScope(array);
                });

                it('should call the callback with the proper parameter and the scope', function () {
                    iterateThroughTheArray(array, 0);

                    expect(callback).toHaveBeenCalledWithScope(scope);
                    expect(callback).toHaveBeenCalledWith(array[0], 0, array);
                });

                it('should not check it again', function () {
                    Array.prototype.forEach = null;

                    // I know, this is weird. But in the real scenario when forEach is supported
                    // if you overwrite it, it will crash
                    expect(function () {
                        arrayInstance.forEach(array, callback, scope);
                    }).toThrow();
                });

                describe('when a non iterable is passed in again', function () {

                    it('should throw an exception', function () {
                        var errorMsg = 'Wrong collections passed in. ' +
                        'Please if you want to iterate through an object, ' +
                        'please use GP.utils.Object.forEach';

                        expect(function () {
                            arrayInstance.forEach(500, callback, scope);
                        }).toThrow(errorMsg);
                    });
                });
            });
        });

        describe('otherwise', function () {

            beforeEach(function () {
                Array.prototype.forEach = null;
            });

            describe('when a non iterable is passed in', function () {

                it('should throw an exception', function () {
                    var errorMsg = 'Wrong collections passed in. ' +
                    'Please if you want to iterate through an object, ' +
                    'please use GP.utils.Object.forEach';

                    expect(function () {
                        arrayInstance.forEach(500, callback, scope);
                    }).toThrow(errorMsg);
                });

                describe('if a empty array is passed in', function () {

                    it('should not throw', function () {
                        expect(function () {
                            arrayInstance.forEach([], callback, scope);
                        }).not.toThrow();
                    });
                });
            });


            describe('otherwise', function () {

                beforeEach(function () {
                    arrayInstance.forEach(array, callback, scope);
                });

                it('should loop through the whole array', function () {
                    expect(callback.calls.count()).toEqual(3);
                });

                it('should call the callback with the proper parameter and the scope', function () {
                    var args = callback.calls.mostRecent().args;

                    expect(callback).toHaveBeenCalledWithScope(scope);
                    expect(args[0]).toEqual(array[2]);
                    expect(args[1]).toEqual(2);
                    expect(args[2]).toEqual(array);
                });

                it('should not check again', function () {
                    Array.prototype.forEach = jasmine.createSpy();

                    arrayInstance.forEach(array, callback, scope);

                    expect(Array.prototype.forEach).not.toHaveBeenCalled();
                });

                describe('when a non iterable is passed in again', function () {

                    it('should throw an exception', function () {
                        var errorMsg = 'Wrong collections passed in. ' +
                        'Please if you want to iterate through an object, ' +
                        'please use GP.utils.Object.forEach';

                        expect(function () {
                            arrayInstance.forEach(500, callback, scope);
                        }).toThrow(errorMsg);
                    });
                });
            });
        });
    });
});
