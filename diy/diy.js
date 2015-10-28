/*global DIY: true*/

var DIY = (function () {
	var jsPath = '',

	composeScriptUrl = function (module) {
		var parts = module.split('.');

		parts.shift();

		return jsPath + parts.join('/') + '.js';
	},

	getScript = function (module) {
	    var script = document.createElement('script'),
	    	src = composeScriptUrl.call(this, module);

	    script.setAttribute('type', 'text/javascript');
	    script.setAttribute('src', src);

	    return script;
	},

	loadDependencies = function (requires) {
		var i,
			docfrag = document.createDocumentFragment(),
			head = document.getElementsByTagName('head')[0];

		for (i = 0; i < requires.length; i++) {
			docfrag.appendChild(getScript.call(this, requires[i]));
		}

		head.appendChild(docfrag);
	},

	define = function (namespace, requires, body) {
			var levels = namespace.split('.'),
				appName = levels[0],
				i,
				root = window[appName] ? window[appName] : {};

			if (requires.length > 0) {
				loadDependencies.call(this, requires);
			}

			window[appName] = root;

			for (i = 1; i < levels.length; i++) {
				if (i < levels.length -  1) {
					root[levels[i]] = root[levels[i]] ? root[levels[i]] : {};
				} else {
					root[levels[i]] = body;
				}

				root = root[levels[i]];
			}
		};

	return {
		define: function () {
			throw 'App not initialized. Please call DIY.init with proper params';
		},

		/**.*/
		init: function (cfg) {
			this.define = define;

			jsPath = cfg.jsPath;
		}
	};
})();