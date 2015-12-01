# diyJs

Do It Yourself

DiyJs is a set of tools for those javascript developers who love OOP but at the same time they want to have the freedom of organize the code and use the pattern that they want. The idea is to allow programmers to download only whose part of the framework which they are interested on.

## Important notice: This framework is still not ready to be used.

### Features in place:

- Define method -> This define your namespaces. Features supported:
    - Singleton
    - Constructors
    - Inheritance
    - Polymorphism
    - Lazy load of dependencies

#### Example

```javascript
DIY.define('MYAPP.controllers.Maincontroller', {
    extend: 'MYAPP.controllers.ControllerBase',
    requires: [
        'MYAPP.views.Mainview'
    ]
}, function (config) {
    this.myConfig = config;
});

MYAPP.controllers.Maincontroller.prototype.myPublicMethod = function () {
    ....my code here
};

var myController = new MYAPP.controllers.Maincontroller(myConfigHere);
```

