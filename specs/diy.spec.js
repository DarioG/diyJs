/* global MYAPP */
describe('DIY', function () {

	describe('define()', function () {

		describe('if the application has not been initialized', function () {

			it('should throw an exception', function () {
				expect(function () {
					DIY.define('MYAPP.modules.moduleA', function () {});
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

			it('should add to the namespace', function () {
				var myModule;

				DIY.define('MYAPP.modules.moduleA', [], function () {
					return {
						attr: 'module1'
					};
				});

				myModule = new MYAPP.modules.moduleA();
				expect(myModule.attr).toBe('module1');

				DIY.define('MYAPP.modules.moduleB', [], function () {
					return {
						attr: 'module2'
					};
				});

				myModule = new MYAPP.modules.moduleB();
				expect(myModule.attr).toBe('module2');
			});

			describe('if some dependencies are required', function () {

				describe('when the dependencies are not already been loaded', function () {

					it('should load the required dependency', function () {
						var head = {
								appendChild: jasmine.createSpy()
							},
							args;

						spyOn(document, 'getElementsByTagName').and.returnValue([head]);

						DIY.define('MYAPP.modules.moduleB', ['MYAPP.modules.moduleA'], function () {
							return {};
						});

						args = head.appendChild.calls.mostRecent().args[0];

						expect(args.childElementCount).toEqual(1);
						expect(args.childNodes[0].src).toEqual(jsPath + 'modules/moduleA.js');
						expect(args.childNodes[0].type).toEqual('text/javascript');
					});
				});

				describe('when the dependencies have already been loaded', function () {

					it('should not load them again', function () {
						var head = {
								appendChild: jasmine.createSpy()
							},
							args;

						spyOn(document, 'getElementsByTagName').and.returnValue([head]);

						DIY.define('MYAPP.modules.moduleA', [], function () {});

						DIY.define('MYAPP.modules.moduleB', ['MYAPP.modules.moduleA', 'MYAPP.modules.module1'], function () {
							return {};
						});

						args = head.appendChild.calls.mostRecent().args[0];

						expect(args.childElementCount).toEqual(1);
						expect(args.childNodes[0].src).toEqual(jsPath + 'modules/module1.js');
						expect(args.childNodes[0].type).toEqual('text/javascript');
					});
				});
			});
		});
	});
});