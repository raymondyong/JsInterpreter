var red_configurations = {}; 

red_configurations.resource_mappings = 
    {
        hosts: {
                "rdc_api" : { 
                    "address": "qa.api2.move.com", 
                    "token": ""
                    }
            },
        
        handlers: {
                "listings_search": { "host": "rdc_api", "path": "/v2/listings/search"} ,
                "listings_show": { "host": "rdc_api", "path": "/v2/listings/show" }
        },
        
    };

exports.configurations = red_configurations;