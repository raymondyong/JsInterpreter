
var vm = require('vm');

thread.on('giveMeAggregation',
          function(response, javascript, console) {    // response is accessible in the javascript text.
                console.log('  - thread is running' + this.id);
                var sandbox = {};
                
                // run client's javascript in a vm context.
                // runInNewContext() is a blocking call, so pray that ad-hoc code in javascript doesn't block.
                vm.runInNewContext(javascript, sandbox);  
            });