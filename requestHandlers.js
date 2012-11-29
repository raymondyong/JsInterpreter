
var threadPool = require('threads_a_gogo').createPool(2);
threadPool.load('./thread_code.js');


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
    
    response.writeHead(200, {"Content-Type": "text/plain"});
    
    // How do I know the thread issueing 'end' event is the same thread that I issued emit()?
    threadPool.any.emit('giveMeAggregation', response, javascript);
    
    threadPool.on('end', function cb (data) {
        response.write(data);
        response.end();
    });
        
    this.emit('giveMeTheFibo', 35, req);
});

}

exports.index = index;
exports.aggregate = aggregate;

