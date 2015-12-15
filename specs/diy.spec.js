/* global MYAPP:true */
describe('DIY', function () {

    describe('define()', function () {

        describe('if the application has not been initialized', function () {

            it('should throw an exception', function () {
                expect(function () {
                    DIY.define('MYAPP.modules.moduleA', {}, function () {});
                }).toThrow('App not initialized. Please call DIY.init with proper params');
            });
        });

        describe('when the application has been initialized', function () {

            var jsPath,
                head;

            beforeEach(function () {
                jsPath = 'http://localhost/myjsPath/';

                DIY.init({
                    jsPath: jsPath
                });

                head = {
                    appendChild: jasmine.createSpy()
                };

                spyOn(document, 'getElementsByTagName').and.returnValue([head]);
            });

            afterEach(function () {
                MYAPP = null;
            });

            describe('if the namespace was already created', function () {

                it('should throw an exception', function () {
                    var namespace = 'MYAPP.modules.moduleA';

                    DIY.define(namespace, {}, function () {});

                    expect(function () {
                        DIY.define(namespace, {}, function () {});
                    }).toThrow('The constructor "' + namespace +
                    '" was already defined. Please check.');
                });
            });

            describe('if the namespace was NOT already created', function () {

                describe('if the class is defined as singleton', function () {

                    var mySingletonInstance;

                    beforeEach(function () {
                        DIY.define('MYAPP.modules.mySingleton', {
                            singleton: true
                        }, function () {
                            this.attr = 'mySingleton';
                        });

                        mySingletonInstance = new MYAPP.modules.mySingleton();
                    });

                    it('should be able to access to the static methods', function () {
                        expect(mySingletonInstance.attr).toEqual('mySingleton');
                    });

                    describe('when a new instance is declared', function () {

                        it('should be a reference to previous one', function () {
                            var newInstanceOfSingleton = new MYAPP.modules.mySingleton();

                            expect(newInstanceOfSingleton).toBe(mySingletonInstance);
                        });
                    });

                    describe('if a initialize method was created', function () {

                        it('can be initialized with params', function () {
                            var instance;

                            DIY.define('MYAPP.modules.mySingletonWithInitialize', {
                                singleton: true
                            }, function () {
                                this.attr = '';
                                this.initialize = function (cfg) {
                                    this.attr = cfg.attr;
                                };
                            });

                            instance = new MYAPP.modules.mySingletonWithInitialize({
                                attr: 'yicolayea'
                            });

                            expect(instance.attr).toEqual('yicolayea');
                        });
                    });

                    describe('if a parent constructor is passed in', function () {

                        it('should throw an exception', function () {
                            var msg = 'Inheritance for singleton objects is not supported.';

                            expect(function () {
                                DIY.define('MYAPP.modules.mySingletonWithParent', {
                                    singleton: true,
                                    extend: 'MYAPP.modules.moduleA'
                                }, function () {});
                            }).toThrow(msg);
                        });
                    });
                });

                describe('if the class is defined as NON singleton', function () {

                    describe('but the constructor has not a initialize method', function () {

                        describe('when we instanciate it', function () {

                            it('should throw an exception', function () {
                                var myModule;

                                DIY.define('MYAPP.modules.ModuleA', {}, function () {
                                    this.attr = 'module1';
                                });
                                expect(function () {
                                    myModule = new MYAPP.modules.ModuleA();
                                }).toThrow();
                            });
                        });
                    });

                    describe('otherwise', function () {

                        it('should add to the namespace', function () {
                            var myModule;

                            DIY.define('MYAPP.modules.moduleA', {}, function () {
                                this.attr = 'module1';
                                this.initialize = function () {};
                            });

                            myModule = new MYAPP.modules.moduleA();
                            expect(myModule.attr).toBe('module1');

                            DIY.define('MYAPP.modules.moduleB', {}, function () {
                                this.attr = 'module2';
                                this.initialize = function () {};
                            });

                            myModule = new MYAPP.modules.moduleB();
                            expect(myModule.attr).toBe('module2');
                        });

                        it('should initialize it', function () {
                            var myModule;

                            DIY.define('MYAPP.modules.moduleA', {}, function () {
                                this.attr = '';
                                this.initialize = function (cfg) {
                                    this.attr = cfg.attr;
                                };
                            });

                            myModule = new MYAPP.modules.moduleA({
                                attr: 'yeja'
                            });
                            expect(myModule.attr).toBe('yeja');
                        });

                        describe('if some dependencies are required', function () {

                            describe('and these have not already been loaded', function () {

                                it('should load the required dependency', function () {
                                    var args,
                                        filePath = jsPath + 'modules/moduleA.js';

                                    DIY.define('MYAPP.modules.moduleB', {
                                        requires: ['MYAPP.modules.moduleA']
                                    }, function () {});

                                    args = head.appendChild.calls.mostRecent().args[0];

                                    expect(args.childElementCount).toEqual(1);
                                    expect(args.childNodes[0].src).toEqual(filePath);
                                    expect(args.childNodes[0].type).toEqual('text/javascript');
                                });
                            });

                            describe('when the dependencies have already been loaded', function () {

                                it('should not load them again', function () {
                                    var args,
                                        filePath = jsPath + 'modules/module1.js';

                                    DIY.define('MYAPP.modules.moduleA', {}, function () {});

                                    DIY.define('MYAPP.modules.moduleB', {
                                        requires: ['MYAPP.modules.moduleA', 'MYAPP.modules.module1']
                                    }, function () {});

                                    args = head.appendChild.calls.mostRecent().args[0];

                                    expect(args.childElementCount).toEqual(1);
                                    expect(args.childNodes[0].src).toEqual(filePath);
                                    expect(args.childNodes[0].type).toEqual('text/javascript');
                                });
                            });
                        });

                        describe('when a parent constructor is passed in', function () {

                            describe('and the parent class is defined', function () {

                                beforeEach(function () {
                                    DIY.define('MYAPP.modules.Parent', {}, function () {
                                        this.attr = '';

                                        this.initialize = function (cfg) {
                                            this.attr = (cfg && cfg.attr) ? cfg.attr : 'module1';
                                        };

                                        this.getMessage = function () {
                                            return 'this is the parent method';
                                        };
                                    });
                                });

                                it('should initialize the parent constructor', function () {
                                    var child;

                                    DIY.define('MYAPP.modules.Child', {
                                        extend: 'MYAPP.modules.Parent'
                                    }, function () {
                                        this.initialize = function (cfg) {
                                            this.parentClass.initialize(cfg);
                                        };
                                        this.getAttr = function () {
                                            return this.attr;
                                        };
                                    });

                                    child = new MYAPP.modules.Child({
                                        attr: 'This should work'
                                    });

                                    expect(child.getAttr()).toEqual('This should work');
                                });

                                it('should inherit the parent method and properties', function () {
                                    var child;

                                    DIY.define('MYAPP.modules.Child', {
                                        extend: 'MYAPP.modules.Parent'
                                    }, function () {
                                        this.initialize = function () {};
                                    });

                                    child = new MYAPP.modules.Child();

                                    expect(child.getMessage()).toEqual('this is the parent method');
                                    expect(child instanceof MYAPP.modules.Parent).toBe(true);
                                });

                                it('should allow polymorphism', function () {
                                    var child,
                                        msg = 'this is the parent method called from the child';

                                    DIY.define('MYAPP.modules.Child', {
                                        extend: 'MYAPP.modules.Parent'
                                    }, function () {

                                        this.getMessage = function () {
                                            return this.parentClass.getMessage() +
                                                ' called from the child';
                                        };
                                    });

                                    child = new MYAPP.modules.Child();

                                    expect(child.getMessage()).toEqual(msg);
                                });

                                describe('when another class inherits from the child', function () {

                                    it('should get the props of the grandparent', function () {
                                        var instance;

                                        DIY.define('MYAPP.modules.Child', {
                                            extend: 'MYAPP.modules.Parent'
                                        }, function () {
                                            this.initialize = function (cfg) {
                                                this.parentClass.initialize(cfg);
                                            };

                                            this.getMessage = function () {
                                                return this.parentClass.getMessage() +
                                                ' called from the child';
                                            };
                                        });

                                        DIY.define('MYAPP.modules.GrandChild', {
                                            extend: 'MYAPP.modules.Child'
                                        }, function () {
                                            this.initialize = function (cfg) {
                                                this.parentClass.initialize(cfg);
                                            };

                                            this.getMessage = function () {
                                                return this.parentClass.getMessage() +
                                                ' called from the grandchild';
                                            };
                                        });

                                        instance = new MYAPP.modules.GrandChild({
                                            attr: 'this is a GrandChild'
                                        });

                                        expect(instance.attr).toEqual('this is a GrandChild');
                                        expect(instance.getMessage()).toEqual(
                                                'this is the parent method' +
                                                ' called from the child' +
                                                ' called from the grandchild');
                                    });
                                });
                            });

                            describe('but the parent class is not defined', function () {

                                it('should throw an exception', function () {
                                    expect(function () {
                                        DIY.define('MYAPP.modules.Child', {
                                            extend: 'MYAPP.modules.Parent'
                                        }, function () {});
                                    }).toThrow('Parent constructor should be loaded' +
                                        ' manually to inherit from it.');
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
