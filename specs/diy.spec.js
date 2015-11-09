/* global MYAPP */
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

			var jsPath;

			beforeEach(function () {
				jsPath = 'http://localhost/myjsPath/';

				DIY.init({
					jsPath: jsPath
				});
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

			describe('otherwise', function () {

				it('should add to the namespace', function () {
					var myModule;

					DIY.define('MYAPP.modules.moduleA', {}, function () {
						this.attr = 'module1';
					});

					myModule = new MYAPP.modules.moduleA();
					expect(myModule.attr).toBe('module1');

					DIY.define('MYAPP.modules.moduleB',{}, function () {
						this.attr = 'module2';
					});

					myModule = new MYAPP.modules.moduleB();
					expect(myModule.attr).toBe('module2');
				});

				describe('if some dependencies are required', function () {

					var head;

					beforeEach(function () {
						head = {
							appendChild: jasmine.createSpy()
						};

						spyOn(document, 'getElementsByTagName').and.returnValue([head]);
					});

					describe('when the dependencies are not already been loaded', function () {

						it('should load the required dependency', function () {
							var args;

							DIY.define('MYAPP.modules.moduleB', {
								requires: ['MYAPP.modules.moduleA']
							}, function () {});

							args = head.appendChild.calls.mostRecent().args[0];

							expect(args.childElementCount).toEqual(1);
							expect(args.childNodes[0].src).toEqual(jsPath + 'modules/moduleA.js');
							expect(args.childNodes[0].type).toEqual('text/javascript');
						});
					});

					describe('when the dependencies have already been loaded', function () {

						it('should not load them again', function () {
							var args;

							DIY.define('MYAPP.modules.moduleA', {}, function () {});

							DIY.define('MYAPP.modules.moduleB', {
								requires: ['MYAPP.modules.moduleA', 'MYAPP.modules.module1']
							}, function () {});

							args = head.appendChild.calls.mostRecent().args[0];

							expect(args.childElementCount).toEqual(1);
							expect(args.childNodes[0].src).toEqual(jsPath + 'modules/module1.js');
							expect(args.childNodes[0].type).toEqual('text/javascript');
						});
					});
				});

				describe('when a parent constructor is passed in', function () {

					describe('and the parent class is defined', function () {

						it('should inherit the parent method and properties', function () {
							var child;

							DIY.define('MYAPP.modules.parent', {}, function () {
								this.attr = 'module1';

								this.getMessage = function () {
									return 'this is the parent mathod';
								};
							});

							DIY.define('MYAPP.modules.Child', {
								extend: MYAPP.modules.parent
							}, function () {});

							child = new MYAPP.modules.Child();

							expect(child.getMessage()).toEqual('this is the parent mathod');
							expect(child instanceof MYAPP.modules.parent).toBe(true);
						});
					});
				});
			});
		});
	});
});