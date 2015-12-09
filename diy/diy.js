/*global DIY: true*/
/* exported DIY */

/**
* @namespace
*/
var DIY = (function (window) {
    var jsPath = '',

    composeScriptUrl = function (namespace) {
        var parts = namespace.split('.'),
            constructorName = parts.pop();

        parts.shift();

        return jsPath + parts.join('/') + '/' + constructorNameToFileName(constructorName) + '.js';
    },

    constructorNameToFileName = function (name) {
        return name.charAt(0).toLowerCase() + name.substr(1);
    },

    getScript = function (namespace) {
        var script = document.createElement('script'),
            src = composeScriptUrl.call(this, namespace);

        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', src);

        return script;
    },

    isConstructorDefined = function (namespace) {
        var parts = namespace.split('.'),
            root = window[parts.shift()],
            currentPart,
            i;

        for (i = 0; i < parts.length; i++) {
            currentPart = parts[i];

            if (!root[currentPart]) {
                return false;
            }

            root = root[currentPart];
        }

        return true;
    },

    loadDependencies = function (requires) {
        var i,
            docfrag = document.createDocumentFragment(),
            head = document.getElementsByTagName('head')[0];

        for (i = 0; i < requires.length; i++) {
            if (!isConstructorDefined(requires[i])) {
                docfrag.appendChild(getScript.call(this, requires[i]));
            }
        }

        head.appendChild(docfrag);
    },

    /**
    * Define your namespace with this method. <br />
    *
    * NOTE: you need to init the framework first, calling {DYI.init} init() <br />
    *
    * In this version you can: <br />
    *   * Define classes <br />
    *   * Use inheritance <br />
    *   * Lazy load of dependencies. <br />
    *   * Polymorphism <br />
    *   * Define a singleton class ( inheritance is not supported here yet ) <br />
    *
    * @example
    * <caption>The regular way to define a constructor would be:</caption>
    *
    *   DIY.define('MyNameSpace', {}, function () {
    *       var myPrivatevar = 1;
    *
    *       this.myPublicMethod = function () {
    *           return myPrivatevar;
    *       }:
    *   });
    * @example
    * <caption>If the constructor has some dependencies:</caption>
    *
    *   DIY.define('MyNameSpace', {
    *       requires: [
    *           'MYAPP.module.myModuleNeeded1',
    *           'MYAPP.module.myModuleNeeded2'
    *       ]
    *   }, function () {
    *       var myPrivatevar = 1;
    *
    *       this.myPublicMethod = function () {
    *           return myPrivatevar;
    *       };
    *   });
    *
    * 
    *
    * @example
    * <caption>This will load the dependencies, if not yet loaded, asyncronously </br></br></br>
    * 
    *   If the constructor inherits from anyone else:
    * </caption>
    *
    *   DIY.define('MyNameSpace', {
    *       extend: 'MYAPP.module.ParentModule'
    *   }, function () {
    *       var myPrivatevar = 1;
    *
    *       this.myPublicMethod = function () {
    *           return myPrivatevar;
    *       };
    *   });
    *
    * @example
    * <caption>This will add one instance of "ParentModule" to the prototype of MyNameSpace </br>
    * NOTE: In this version the parent namespace should be already loaded.
    *  There not load lazy loading implemented for parent constructors </br></br></br>
    *
    * Parent constructor will be initialized with the arguments passed in to the child constructor,
    * as it is supposed to be, i.e
    * </caption>
    *
    *   DIY.define('ParentModule', {}, function (cfg) {
    *       var myPrivatevar = cfg.private;
    *   });
    *
    *   DIY.define('MyNameSpace', {
    *       extend: 'MYAPP.module.ParentModule'
    *   }, function () {
    *       this.myPublicMethod = function () {
    *           return myPrivatevar;
    *       };
    *   });
    *
    *
    *   var myChildInstance = MyNameSpace({
    *       private: 'foo'
    *   });
    *
    *
    *   myChildInstance.myPublicMethod(); // this will return 'foo'
    *
    * @example
    * <caption>
    *   Polymorphism ist allowed, you just have to call this.parentClass.methodName(), i.e.
    * </caption>
    *
    *   DIY.define('ParentModule', {}, function (cfg) {
    *       var myPrivatevar = cfg.private;
    *
    *       this.myPublicMethod = function () {
    *           return myPrivatevar;
    *       };
    *   });
    *
    *   DIY.define('MyNameSpace', {
    *       extend: 'MYAPP.module.ParentModule'
    *   }, function () {
    *       this.myPublicMethod = function () {
    *           return this.parentClass.myPublicMethod() + ' and bar';
    *       };
    *   });
    *
    *
    *   var myChildInstance = MyNameSpace({
    *       private: 'foo'
    *   });
    *
    *
    *   myChildInstance.myPublicMethod(); // this will return 'foo and bar'
    *
    *
    * @example
    * <caption>You can also define a singleton class, i.e.</caption>
    *
    *   DIY.define('singletonClass', {
    *       singleton: true
    *   }, function () {
    *       this.myPublicMethod = function () {
    *           return 'my singleton object';
    *       };
    *   });
    *
    * @example
    * <caption>then you will be able to access to the public methods directly like this</caption>
    * 
    *  singletonClass.myPublicMethod(); // this will return 'my singleton object'
    * 
    * @example
    * <caption>
    *   otherwise if you try to instanciate again with new, it will throw an exception
    * </caption>
    *
    *  var myNewInstance = new singletonClass(); // This will throw
    *
    * @param {String} namespace
    * @param {Object} config Some configurations for the definition of the constructor
    * @param {Function} config.extend. This parameter is mandatory.
    *   If you dont need inheritance, just pass null, empty string or undefined.
    * @param {Array} config.requires. Array with the modules which are required.
    *   If you dont need dependencies, just pass an empty array
    * @param {Function} body. Constructor code
    * @memberof DIY
    */
    define = function (namespace, config, body) {
        var parts = namespace.split('.'),
            appName = parts[0],
            requires = config.requires;

        if (!window[appName]) {
            window[appName] = {};
        }

        if (requires && requires.length > 0) {
            loadDependencies.call(this, requires);
        }

        createNamespace.call(this, parts, body, config);
    },

    createNamespace = function (parts, body, config) {
        var i,
            length = parts.length,
            current,
            root = window[parts[0]];

        for (i = 1; i < length; i++) {
            current = parts[i];

            if (i < length -  1) {
                root[current] = !root[current] ? {} : root[current];

                root = root[current];
            }
        }

        if (root[current]) {
            throw 'The constructor "' + parts.join('.') + '" was already defined. Please check.';
        }

        root[current] = getClass.call(this, body, config.singleton, config.extend);
    },

    findConstructor = function (namespace) {
        var parts = namespace.split('.'),
            root = window[parts.shift()],
            currentPart,
            i;

        for (i = 0; i < parts.length; i++) {
            currentPart = parts[i];

            if (!root[currentPart]) {
                return false;
            }

            root = root[currentPart];
        }

        return root;
    },

    inherit = function (child, Parent) {
        var borrowedConstructor = function () {
                Parent.apply(this, arguments);
                child.apply(this, arguments);
            },
            instance = new Parent();

        borrowedConstructor.prototype = instance;
        borrowedConstructor.prototype.parentClass = instance;

        return borrowedConstructor;
    },

    isThereAParentConstructor = function (constructor) {
        return !!constructor;
    },

    getClass = function (Constructor, singleton, parent) {
        if (singleton) {
            return getSingletonObject.call(this, Constructor, parent);
        }

        return getConstructor.call(this, Constructor, parent);
    },

    getSingletonObject = function (Constructor, parent) {
        if (isThereAParentConstructor.call(this, parent)) {
            throw 'Inheritance for singleton objects is not supported.';
        }

        return new Constructor();
    },

    getConstructor = function (Constructor, parent) {
        if (isThereAParentConstructor.call(this, parent)) {
            if (isConstructorDefined.call(this, parent)) {
                return inherit(Constructor, findConstructor.call(this, parent));
            } else {
                throw 'Parent constructor should be loaded manually to inherit from it.';
            }
        } else {
            return Constructor;
        }
    },

    /**
    * You need to call this method at the beggining of you app with the proper config object
    *   otherwise you wont be able to use the framework.
    * @param {Object} cfg
    * @param {String} cfg.jsPath Path to the place where your js modules are placed. i.e.
    * <pre>
    *   jsPath: 'http://localhost/assets/js/src/'
    * </pre>
    * @memberof DIY
    */
    init = function (cfg) {
        this.define = define;

        jsPath = cfg.jsPath;
    };

    return {
        define: function () {
            throw 'App not initialized. Please call DIY.init with proper params';
        },
        init: init
    };
})(window);
