
// var exec = require("child_process").exec;
var red = require('./red');
var vm = require('vm');
var https = require('https');

function index(response, postData){
    console.log("    - Request handler 'index' was called.");

    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/aggregate" method="post">'+
        '<textarea name="text" rows="20" cols="100"></textarea>'+
        '<input type="submit" value="Submit text" />'+
        '</form>'+
        '</body>'+
        '</html>';
    
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function aggregate(response, javascript){
    console.log("    - Request handler 'aggregate' was called.");
    
    var sandbox = {
        query : function(handler_name, query, callback){
                    var handler = red.configurations.resource_mappings.handlers[handler_name];
                    var host = red.configurations.resource_mappings.hosts[handler.host];
                    var options = {
                            hostname: host.address,
                            port: 443,
                            path: handler.path + "?" + query + '&api_token=' + host.token,
                            rejectUnauthorized: false,
                            requestCert: true,
                            agent: false                            
                    };
                    https.get(options,
                            function(api_res)
                            {
                                var data = "";
                                api_res.setEncoding('utf8');
                                api_res.addListener(
                                    "data", 
                                    function(chunk){
                                        data += chunk.toString('utf8');
                                    });
                        
                                api_res.addListener(
                                            "end", 
                                            function() {
                                                callback(data, response);
                                    });
                            });
                }
        };
    
    vm.runInNewContext(javascript, sandbox, 'blah.vm');
//    response.writeHead(200, {"Content-Type": "text/plain"});
//    response.write(util.inspect(sandbox));
//    response.end();
}

exports.index = index;
exports.aggregate = aggregate;

