/*global DIY: true*/

var DIY = (function (w) {
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

	isModuleAlreadyLoaded = function (module) {
		var parts = module.split('.'),
			root = w[parts.shift()],
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
			if (!isModuleAlreadyLoaded(requires[i])) {
				docfrag.appendChild(getScript.call(this, requires[i]));
			}
		}

		head.appendChild(docfrag);
	},

	/**.*/
	define = function (namespace, requires, body) {
		var parts = namespace.split('.'),
			appName = parts[0];

		if (!w[appName]) {
			w[appName] = {};
		}

		if (requires.length > 0) {
			loadDependencies.call(this, requires);
		}

		createNamespace.call(this, w[appName], parts, body);
	},

	createNamespace = function (root, parts, body) {
		var i,
			length = parts.length,
			current;

		for (i = 1; i < length; i++) {
			current = parts[i];

			if (i < length -  1) {
				if (!root[current]) {
					root[current] = {};
				}
			} else {
				root[current] = body;
			}

			root = root[current];
		}
	},

	/**.*/
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