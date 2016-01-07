/*
* Custom matchers
*/
beforeEach(function () {
    jasmine.addMatchers({
        toHaveBeenCalledWithScope: function () {
            return {
                compare: function (actual, expected) {
                    var result = {
                        pass: true
                    };

                    if (actual.calls.all().length === 0) {
                        result.message = 'Expected spy to be called with ' +
                            expected + ' scope, but it was not called';
                        result.pass = false;
                    } else if (actual.calls.mostRecent().object !== expected) {
                        result.message = 'Expected spy to be called with ' + expected +
                            ' scope, but it was not called with the proper scope';
                        result.pass = false;
                    }

                    return result;
                }
            };
        }
    });
});
