var DIY = /*DIY ? DIY : */{};

DIY = (function () {

	return {
		define: function (namespace, body) {
			var levels = namespace.split('.'),
				appName = levels[0],
				i,
				root = window[appName] ? window[appName] : {};

			window[appName] = root;

			for (i = 1; i < levels.length; i++) {
				if (i < levels.length -  1) {
					root[levels[i]] = root[levels[i]] ? root[levels[i]] : {};
				} else {
					root[levels[i]] = body;
				}

				root = root[levels[i]];
			}
		}
	};
})();