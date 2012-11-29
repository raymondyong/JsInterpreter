
var vm = require('vm');
var https = require('https');
var red = require('./red');

thread.on('giveMeAggregation',
          function(javascript, console) {    
                var sandbox = {
                    result: '',
                    query: function (handler_name, show, querystring, callback){
                                var handler = red.configurations.resource_mappings.handlers[handler_name];
                                var host = red.configurations.resource_mappings.hosts[handler.host];
                                var options = {
                                        hostname: host.address,
                                        port: 443,
                                        path: handler.path + (show ? '/' + show : '') + '?' + (querystring ? querystring + '&' : '') + 'api_token=' + host.token,
                                        rejectUnauthorized: false,
                                        requestCert: true,
                                        agent: false                            
                                };
                                https.get(options,
                                        function(api_res)
                                        {
                                            var data = '';
                                            api_res.setEncoding('utf8');
                                            api_res.addListener(
                                                'data', 
                                                function(chunk){
                                                    data += chunk.toString('utf8');
                                                });
                                    
                                            api_res.addListener(
                                                        'end', 
                                                        function() {
                                                            callback(data);
                                                });
                                        });
                            }
                };
                
                // run client's javascript in a vm context.
                // runInNewContext() is a blocking call, so pray that ad-hoc code in javascript doesn't block.
                vm.runInNewContext(javascript, sandbox);  
            });
            
            