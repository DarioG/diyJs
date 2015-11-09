/*global DIY: true*/

/**
* @namespace
*/
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

	/**
	* Define your namespace with this method. <br />
	* NOTE: you need to init the framework first, calling {DYI.init} init() <br />
	* The regular way to define a constructor would be:
	* <pre>
	*	DIY.define('myNameSpace', {}, function () {
	*		var myPrivatevar = 1;
	*
	*		this.myPublicMethod = function () {
	*			return myPrivatevar;
	*		}
	* 	})
	*
	* If the constructor has some dependencies:
	* <pre>
	*	DIY.define('myNameSpace', {
	*		requires: [
	*			'MYAPP.module.myModuleNeeded1',
	*			'MYAPP.module.myModuleNeeded2'
	*		]
	*	}, function () {
	*		var myPrivatevar = 1;
	*
	*		this.myPublicMethod = function () {
	*			return myPrivatevar;
	*		}
	* 	})
	* </pre>
	* This will load the dependencies, if they were not already loaded, asyncronously
	*
	* If the constructor inherits from anyone else:
	* <pre>
	*	DIY.define('myNameSpace', {
	*		extend: 'MYAPP.module.parentModule'
	*	}, function () {
	*		var myPrivatevar = 1;
	*
	*		this.myPublicMethod = function () {
	*			return myPrivatevar;
	*		}
	* 	})
	* </pre>
	* This will add one instance of "parentModule" to the prototype of myNameSpace
	* @param {String} namespace
	* @param {Object} config Some configurations for the definition of the constructor
	* @param {Function} config.extend. This parameter is mandotory.
	* 	If you dont need inheritance, just pass null, empty string or undefined.
	* @param {Array} config.requires. Array with the modules which are required.
	* 	If you dont need dependencies, just pass an empty array
	* @param {Function} body. Constructor code
	* @memberof DIY
	*/
	define = function (namespace, config, body) {
		var parts = namespace.split('.'),
			appName = parts[0],
			constructor,
			requires = config.requires,
			ParentNamespace = config.extend;

		if (!w[appName]) {
			w[appName] = {};
		}

		if (requires && requires.length > 0) {
			loadDependencies.call(this, requires);
		}

		constructor = createNamespace.call(this, w[appName], parts, body, namespace);

		if (isThereAParentConstructor.call(this, ParentNamespace)) {
			constructor.prototype = new ParentNamespace();
		}
	},

	isThereAParentConstructor = function (constructor) {
		return typeof constructor === 'function';
	},

	createNamespace = function (root, parts, body, namespace) {
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
				if (root[current]) {
					throw 'The constructor "' + namespace + '" was already defined. Please check.';
				}
				root[current] = body;
			}

			root = root[current];
		}

		return root;
	},

	/**
	* You need to call this method at the beggining of you app with the proper config object
	* 	otherwise you wont be able to use the framework.
	* @param {Object} cfg
	* @param {String} cfg.jsPath Path to the place where your js modules are placed. i.e.
	* <pre>
	* 	jsPath: 'http://localhost/assets/js/src/'
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