# diyJs

Do It Yourself

DiyJs is a set of tools for those javascript developers who love OOP but at the same time they want to have the freedom of organize the code and use the pattern that they want. The idea is to allow programmers to download only whose part of the framework which they are interested on.

## Important notice: This framework is still not ready to be used.

### Features in place:

- DIY.init method -> To initialize your app
    - Params
        - jsPath -> Path to the place where your js modules are placed. This is used for the lazy load

- Define method -> This define your namespaces. Features supported:
    - Singleton
    - Constructors
    - Inheritance
    - Polymorphism
    - Lazy load of dependencies

To see the documentation:

    1. Clone the repo
    2. Install npm dependencies
        npm install
    3. run grunt docs
        grunt doc

### Use guide

Before defining your modules you have to initialize the app with DIY.init(config), ie
    - This is usually done in your app.js or in the first script which is loaded in your app.

```javascript
DIY.init({
    jsPath: 'http://localhost/assets/js/src/' // Path to the place where your js modules are placed. This is used for the lazy load
})
```

Then you can define your modules

#### Example

##### Using prototypes

```javascript
DIY.define('MYAPP.controllers.Maincontroller', {
    extend: 'MYAPP.controllers.ControllerBase',
    requires: [
        'MYAPP.views.Mainview'
    ]
}, function () {});

MYAPP.controllers.Maincontroller.prototype.initialize = function (config) {
    ....my initialization here
};

MYAPP.controllers.Maincontroller.prototype.myPublicMethod = function () {
    ....my code here
};

var myController = new MYAPP.controllers.Maincontroller(myConfigHere);
```

##### Module pattern with constructor pattern

```javascript
DIY.define('MYAPP.controllers.Maincontroller', {
    extend: 'MYAPP.controllers.ControllerBase',
    requires: [
        'MYAPP.views.Mainview'
    ]
}, function () {
    var myPrivateVar,
        mySecondPrivateVar,

        myPrivateMethod = function () {
            //code
        };

    this.myPublicVar;

    this.initialize = function (config) {
        // my initialization code here
    };

    this.publicMethod = function () {
        // my code here
        myPrivateMethod.call(this);
    };
});
```

#### Singleton pattern
##### with initialize method

```javascript
DIY.define('MYAPP.utils.singleton', {
    singleton: true
}, function () {
    this.initialize = function ($, config) {
        $('mySelecto').on('click', myCallback);

        // initialization method
    };

    this.publicMethod = function () {
        // do something here
    }
});

var instance = new MYAPP.utils.singleton(JQuery, {
    // my config here
});

instance.publicMethod(); // we have access to the public API

// Creating a new instance

var instance2 = new MYAPP.utils.singleton(JQuery, {
    // my config here
});

// THe instance is the same
instance === instance2 // true
```

##### without initialize method

```javascript
DIY.define('MYAPP.utils.singleton', {
    singleton: true
}, function () {
    this.publicMethod = function () {
        // do something here
    }
});

var instance = new MYAPP.utils.singleton();

instance.publicMethod(); // we have access to the public API

// Creating a new instance

var instance2 = new MYAPP.utils.singleton();

// THe instance is the same
instance === instance2 // true
```