
// var exec = require("child_process").exec;
var red = require('./red');
var vm = require('vm');
var util = require('util');
var http = require('http');

function index(response, postData){
    console.log("    - Request handler 'index' was called.");

    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/aggregate" method="post">'+
        '<textarea name="text" rows="20" cols="60"></textarea>'+
        '<input type="submit" value="Submit text" />'+
        '</form>'+
        '</body>'+
        '</html>';
    
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function aggregate(aggr_res, javascript){
    console.log("    - Request handler 'aggregate' was called.");
    
    var sandbox = {
        query : function(handler_name, query, callback){
                    var handler = red.configurations.resource_mappings.handlers[handler_name];
                    var host = red.configurations.resource_mappings.hosts[handler.host];
                    var options = {
                            hostname: host.address,
                            port: 80,
                            path: handler.path + query,
                    };
                    http.get(options,
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
                                                callback(data, aggr_res);
                                    });
                            });
                }
        };
    
    vm.runInNewContext(javascript, sandbox, 'blah.vm');
    response.writeHead(200, {"Content-Type": "text/plain"});
    //response.write(util.inspect(sandbox));
    //response.end();
}

exports.index = index;
exports.aggregate = aggregate;

