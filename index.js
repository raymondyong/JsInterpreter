var red = require("./red");
var https = require('https');
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;   // default.
handle["/index"] = requestHandlers.index;
handle["/aggregate"] = requestHandlers.aggregate;

var options = {
    hostname: 'qa.api2.move.com',
    port: 443,
    path: '/v2/auth/gen/PRO/ssl/real?client_id=jsc',
    auth: 'integration_test:toptop', 
    rejectUnauthorized: false,
    requestCert: true,
    agent: false
};


var req = https.get(options,
            function(response)
            {
                console.log("received token:");
                var tokenData = "";
                response.setEncoding('utf8');
                response.addListener(
                    "data", 
                    function(chunk){
                        tokenData += chunk.toString('utf8');
                    });
        
                response.addListener(
                            "end", 
                            function() {
                                console.log("Received ApiToken json:"  + tokenData );
                                red.configurations.resource_mappings.hosts.rdc_api.token = tokenData.api_token;
                                server.start(router.route, handle);
                    });
            });
            
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});


