describe('DIY', function () {

	describe('define()', function () {

		it('should add to the namespace', function () {
			var myModule;

			DIY.define('MYAPP.modules.moduleA', function () {
				return {
					attr: 'module1'
				};
			});

			myModule = new MYAPP.modules.moduleA();
			expect(myModule.attr).toBe('module1');
		});
	});
});