jasmine-terminal-reporter
=========================

A simple terminal reporter for Jasmine, shamelessly stolen from [juliemr/minijasminenode](https://github.com/juliemr/minijasminenode).

installation
------------

Get the library with

    npm install jasmine-terminal-reporter

usage
-----

Depends on your jasmine spec runner, but to import and instantiate the reporter:

```javascript
    var Reporter = require('jasmine-terminal-reporter');

    var reporter = new Reporter(options)
    // At this point, jasmine is available in the global node context.

    // Add your tests by filename.
    miniJasmineLib.addSpecs('myTestFolder/mySpec.js');

    // If you'd like to add a custom Jasmine reporter, you can do so. Tests will
    // be automatically reported to the terminal.
    miniJasmineLib.addReporter(myCustomReporter);

    // Run those tests!
    miniJasmineLib.executeSpecs(options);
```

You can also pass an options object into `executeSpecs`

````javascript
    var miniJasmineLib = require('minijasminenode2');

    var options = {
      // An array of filenames, relative to current dir. These will be
      // executed, as well as any tests added with addSpecs()
      specs: ['specDir/mySpec1.js', 'specDir/mySpec2.js'],
      // A function to call on completion.
      // function(passed)
      onComplete: function(passed) { console.log('done!'); },
      // If true, display suite and spec names.
      isVerbose: false,
      // If true, print colors to the terminal.
      showColors: true,
      // If true, include stack traces in failures.
      includeStackTrace: true,
      // Time to wait in milliseconds before a test automatically fails
      defaultTimeoutInterval: 5000
    };
    miniJasmineLib.executeSpecs(options);
````
