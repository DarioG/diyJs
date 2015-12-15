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
    *   DIY.define('MYAPP.MyNameSpace', {}, function () {
    *       var myPrivatevar;
    *
    *       this.initialize = function () {
    *           myPrivatevar = 1;
    *       };
    *
    *       this.myPublicMethod = function () {
    *           return myPrivatevar;
    *       };
    *   });
    * @example
    * <caption>you should always initialize you class with the initialize method and
    *   not directly in the constructor, ie: </caption>
    *
    *   // Very bad. Init config objec should not be passed here
    *   DIY.define('MYAPP.MyNameSpace', {}, function (cfg) {
    *       var myPrivatevar = 1;  // Bad
    *
    *       // Good. You should pass you config object into the initialize method
    *       this.initialize = function (cfg) {
    *           myPrivatevar = 1; // Good
    *       };
    *
    *       this.myPublicMethod = function () {
    *           return myPrivatevar;
    *       }:
    *   });
    * @example
    * <caption>initialize method is mandatory, unless your class inherits from a class
    *   which already has the initilize method, then the child class will be initialized with
    *   the parent initialize method. <br />
    *   This is private and it should not be called from outside. It is there for initialize
    *   purposes only.</br></br></br>
    *
    *   If the constructor has some dependencies:</caption>
    *
    *   DIY.define('MYAPP.MyNameSpace', {
    *       requires: [
    *           'MYAPP.module.myModuleNeeded1',
    *           'MYAPP.module.myModuleNeeded2'
    *       ]
    *   }, function () {
    *       var myPrivatevar;
    *
    *       this.initialize = function () {
    *           myPrivatevar = 1;
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
    *   DIY.define('MYAPP.MyNameSpace', {
    *       extend: 'MYAPP.module.ParentModule'
    *   }, function () {
    *       var myPrivatevar;
    *
    *       this.initialize = function () {
    *           myPrivatevar = 1;
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
    *  DIY.define('MYAPP.module.ParentModule', {}, function () {
    *      this.myParentVar;
    *
    *      this.initialize = function (cfg) {
    *          this.myParentVar = cfg.private;
    *      };
    *  });
    *
    *  DIY.define('MYAPP.module.MyNameSpace', {
    *      extend: 'MYAPP.module.ParentModule'
    *  }, function () {
    *      this.myPublicMethod = function () {
    *          return this.myParentVar;
    *      };
    *  });
    *
    *
    *  var myChildInstance = new MYAPP.module.MyNameSpace({
    *      private: 'foo'
    *  });
    *
    *
    *  myChildInstance.myPublicMethod();
    *
    * @example
    * <caption>
    *   Polymorphism ist allowed, you just have to call this.parentClass.methodName(), i.e.
    * </caption>
    *
    *   DIY.define('MYAPP.module.ParentModule', {}, function () {
    *       var myPrivatevar;
    *
    *       this.initialize = function (cfg) {
    *           myPrivatevar = cfg.private;
    *       };
    *
    *       this.myPublicMethod = function () {
    *           return myPrivatevar;
    *       };
    *   });
    *
    *   DIY.define('MYAPP.module.MyNameSpace', {
    *       extend: 'MYAPP.module.ParentModule'
    *   }, function () {
    *       this.myPublicMethod = function () {
    *           return this.parentClass.myPublicMethod() + ' and bar';
    *       };
    *   });
    *
    *
    *   var myChildInstance = new MYAPP.module.MyNameSpace({
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
    *   DIY.define('MYAPP.singletonClass', {
    *       singleton: true
    *   }, function () {
    *       this.myPublicMethod = function () {
    *           return 'my singleton object';
    *       };
    *   });
    *
    * @example
    * <caption>then you will be able to access to the public methods like this</caption>
    *
    *  var mySingletonInstance = new MYAPP.singletonClass();
    *  mySingletonInstance.myPublicMethod(); // this will return 'my singleton object'
    *
    * @example
    * <caption>Remember that it will only create the instance the first time you call it.
    *  The following times it will return the same instance.
    *  </caption>
    *
    *  var mySingletonInstance = new MYAPP.singletonClass();
    *  var mySingletonInstance2 = new MYAPP.singletonClass();
    *  mySingletonInstance === mySingletonInstance2; // true
    *
    * @example
    * <caption> You can add a initialize method to a singleton class if you want.
    *   This is not mandatory but this is usefull when you want to initialize a singleton
    *   class or pass dependencies.
    *  </caption>
    *
    *   DIY.define('MYAPP.singletonClass', {
    *       singleton: true
    *   }, function () {
    *       var dependency;
    *
    *       this.initialize = function (cfg) {
    *           dependency = cfg.dependency;
    *       };

    *       this.myPublicMethod = function () {
    *           return dependency;
    *       };
    *   });
    *
    *   var mySingletonInstance = new MYAPP.singletonClass({
    *       dependency: 'hey'
    *   });
    *
    *   mySingletonInstance.myPublicMethod();// hey
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
        var singletonBorrowedConstructor;

        if (isThereAParentConstructor.call(this, parent)) {
            throw 'Inheritance for singleton objects is not supported.';
        }

        singletonBorrowedConstructor = function () {
            var instance = singletonBorrowedConstructor.prototype.instance;
            if (instance) {
                return instance;
            }

            instance = new Constructor();
            if (instance.initialize) {
                instance.initialize.apply(instance, arguments);
            }
            singletonBorrowedConstructor.prototype.instance = instance;

            return singletonBorrowedConstructor.prototype.instance;
        };

        return singletonBorrowedConstructor;
    },

    getConstructor = function (Constructor, parent) {
        if (isThereAParentConstructor.call(this, parent)) {
            if (isConstructorDefined.call(this, parent)) {
                return inherit(Constructor, findConstructor.call(this, parent));
            } else {
                throw 'Parent constructor should be loaded manually to inherit from it.';
            }
        } else {
            return getBorrowedConstructor.call(this, Constructor);
        }
    },

    shouldInitialize = function (config) {
        return !config || !config.__notInitialize;
    },

    getBorrowedConstructor = function (Constructor) {
        var borrowedConstructor = function () {
                if (!this.initialize) {
                    throw 'Error. Class does not have initialize method';
                }

                // when this constructor is called from the inherits method, 
                // initialize method should not be called, since the constructor
                // is nt being initialized yet.
                if (shouldInitialize.call(this, arguments[0])) {
                    this.initialize.apply(this, arguments);
                }
            };

        borrowedConstructor.prototype = new Constructor();
        return borrowedConstructor;
    },

    inherit = function (Child, Parent) {
        var borrowedConstructor,
            instance = new Parent({
                __notInitialize: true
            });

        Child.prototype = instance;
        borrowedConstructor = getBorrowedConstructor.call(this, Child);
        borrowedConstructor.prototype.parentClass = instance;

        return borrowedConstructor;
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
