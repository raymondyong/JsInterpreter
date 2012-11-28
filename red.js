var red_configurations = {}; 

red_configurations.resource_mappings = 
    {
        hosts: {
                "rdc_api" : { 
                    "address": "http://qa.api.move.com/v2/", 
                    "token": ""
                    }
            },
        
        handlers: {
                "listings_search": { "host": "rdc_api", "path": "listings/search"} ,
                "listings_show": { "host": "rdc_api", "path": "listings/show" }
        },
        
    };

exports.configuration = red_configurations;