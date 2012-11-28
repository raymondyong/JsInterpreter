var http = require('http');    // http module is shipped with node.js
var url = require('url');
var wwwforms = require('./third_party_libs/wwwforms');

function start(route, handle){
    function onRequest(request, response){
        var postData = "";
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        
        request.setEncoding("utf8");
        request.addListener(
                    "data", 
                    function(postDataChunk){
                        postData += postDataChunk.toString('utf8');
                    });
        
        request.addListener(
                    "end", 
                    function() {
                        // passing response to handlers.  "you take care of responding!"
                        var decodedPostData = wwwforms.decodeForm(postData).text;
                        console.log("Received POST data:\n   '" + decodedPostData + "'.");
                        route(handle, pathname, response, decodedPostData);
        });
    }
    
    http.createServer(onRequest)    // passing a function ref instead of result, so that the call is asynchronous.
        .listen(process.env.PORT);
    console.log("Server has started.");
}

exports.start = start;