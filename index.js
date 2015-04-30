// Export the TerminalReporter for **Node.js**, with
// backwards-compatibility for the old `require()` API. If we're in
// the browser, add `TerminalReporter` as a global object.
((typeof define === 'function' && typeof define.amd === 'object' && define) || function(definition) {
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = definition();
    } else {
      exports.TerminalReporter = definition();
    }
  } else window[name] = definition();
})(function() {
  var Timer = {
    started: 0,
    elapsed: 0,
    finished: 0,
    start: function() {
      this.started = Date.now();
    },
    getTimeElapsed: function() {
      return (this.finished ? this.finished : Date.now()) - this.started;
    },
    finish: function() {
      this.finished = Date.now();
      return this.getTimeElapsed();
    }
  };
  /**
   * Reporter for the terminal. Based on the console reporter from Jasmine 2.0.0
   * and the verbose terminal reporter from Jasmine-Node.
   *
   * @constructor
   * @param {Object} options
   */
  var TerminalReporter = function(options) {
    options = options || {};

    defaultPrint = function(str) {
      console.log(str);
    };

    var print = options.print || defaultPrint,
      showColors = options.showColors !== false,
      done = options.onComplete || function() {},
      isVerbose = options.isVerbose || false,
      verboseIndent = 0,
      timer = options.timer || Timer,
      includeStackTrace = options.includeStackTrace || false,
      stackFilter = options.stackFilter || function(string) {
        return string
      },
      specCount,
      failureCount,
      failedSpecs = [],
      pendingCount,
      ansi = {
        "off": 0,
        "bold": 1,
        "red": 31,
        "green": 32,
        "yellow": 33,
        "blue": 34,
        "magenta": 35,
        "cyan": 36
      };

    this.jasmineStarted = function(specInfo) {
      if (isVerbose) {
        print('Running ' + specInfo.totalSpecsDefined + ' specs.');
      }
      specCount = 0;
      failureCount = 0;
      pendingCount = 0;
      timer.start();
    };

    this.jasmineDone = function() {

      if (failedSpecs.length) {

        print('Failures: ');
      }
      for (var i = 0; i < failedSpecs.length; i++) {
        specFailureDetails(i, failedSpecs[i]);
      }


      var specCounts = specCount + ' ' + plural('spec', specCount) + ', ' +
        failureCount + ' ' + plural('failure', failureCount);

      if (pendingCount) {
        specCounts += ', ' + pendingCount + ' pending ' + plural('spec', pendingCount);
      }

      print(specCounts);
      var seconds = timer.finish() / 1000;
      print('Finished in ' + seconds + ' ' + plural('second', seconds));



      done(failureCount === 0);
    };

    this.suiteStarted = function(suite) {
      if (isVerbose) {
        print(indent(suite.description, verboseIndent));
        verboseIndent += 2;
      }
    };

    this.suiteDone = function() {
      if (isVerbose) {
        verboseIndent -= 2;
      }
    }

    this.specDone = function(result) {
      specCount++;
      var suffix = '';

      if (result.status == 'pending') {
        pendingCount++;
        var text = isVerbose ? indent(result.description + ': pending', verboseIndent + 2) : '*';
        print(colored('yellow', text));
        return;
      }

      if (result.status == 'passed') {
        var text = isVerbose ? indent(result.description + ': passed', verboseIndent + 2) : '.';
        print(colored('green', text));
        return;
      }

      if (result.status == 'failed') {
        failureCount++;
        failedSpecs.push(result);
        var text = isVerbose ? indent(result.description + ': failed', verboseIndent + 2) : 'F';
        print(colored('red', text));
      }
      // TODO - do we want to output failure info in real-time when verbose?
    };

    function colored(color, str) {
      return showColors ? "\033[" + ansi[color] + "m" + str + "\033[" + ansi["off"] + "m" : str;
    }

    function plural(str, count) {
      return count == 1 ? str : str + 's';
    }

    function repeat(thing, times) {
      var arr = [];
      for (var i = 0; i < times; i++) {
        arr.push(thing);
      }
      return arr;
    }

    function indent(str, spaces) {
      var lines = (str || '').split('\n');
      var newArr = [];
      for (var i = 0; i < lines.length; i++) {
        newArr.push(repeat(' ', spaces).join('') + lines[i]);
      }
      return newArr.join('\n');
    }

    function specFailureDetails(index, result) {
      print((index + 1) + ') ');
      print(result.fullName);

      for (var i = 0; i < result.failedExpectations.length; i++) {
        print(indent((index + 1) + '.' + (i + 1) + ') ', 0));
        var failedExpectation = result.failedExpectations[i];
        print(colored('red', failedExpectation.message));
        if (includeStackTrace) {
          print(indent(stackFilter(failedExpectation.stack), 4));
        }
      }
    }
  };
  return TerminalReporter;
});