



fs = require('fs');
collectionFile = './CasparCGAPI.postman_collection.json';
markdownFile = './result.md';
folderFilter = 'medias';

/**
 * Cleaning result.md
 */
fs.writeFile(markdownFile, '', function(err){
    if (err) {
        console.log(err);
    }else{
        console.log(`${markdownFile} saved !`);
    }
})

fs.readFile(collectionFile, 'utf8', function (err,data){
    if (err){
        console.log(err);
    }else{
        let collection = JSON.parse(data);

        /**
         * FOLDERS
         */
        let folders = collection.item;
        for (let n in folders){
            if (folders[n].name == folderFilter){

          
            const folder = folders[n];
                
            const folderName = folder.name;
            let entryName = 'undefined';

            let description = 'undefined';
            let requestMethod = 'undefined';
            let requestHeaders = 'undefined';
            let requestBody = 'undefined';
            let requestUrlRaw = 'undefined';
            let requestUrlHost = 'undefined';
            let requestUrlPath = 'undefined';

            let responses = false;

            /**
             * ENTRIES
             */
            let entries = folder.item;
            for (let n in entries){
                const entry = entries[n];
                entryName = entry.name;

                /**
                 * REQUEST
                 */
                const request = entry.request;
                if (entry.request){
                    description = entry.request.description;
                    requestMethod = entry.request.method;
                    requestHeaders = entry.request.requestHeaders;
                    requestBody = entry.request.body;
                    requestUrlRaw = entry.request.url.raw;
                    requestUrlHost = entry.request.url.host;
                    requestUrlPath = entry.request.url.path;
                }

                /**
                 * RESPONSE
                 */
                responses = entry.response;
                         

                const template = generate(entryName, requestMethod, requestUrlHost, requestUrlPath, requestBody, responses);
                
                
                
                fs.appendFile(markdownFile, template, function(err){
                    if (err) {
                        throw err;
                        console.log(err);
                    }else{
                        //console.log(`${markdownFile} saved !`);
                    }
                })
            }

        }
        }
    }
});



function generate (entryName, requestMethod, requestUrlHost, requestUrlPath, requestBody, responses){

   
    if (requestUrlHost instanceof Array){
        requestUrlHost = requestUrlHost[0];
        requestUrlHost = requestUrlHost.replace('{{',''); 
        requestUrlHost = requestUrlHost.replace('}}','');    
    }

   

    if (requestUrlPath instanceof Array){
        requestUrlPath = requestUrlPath.join('/');
        requestUrlPath = requestUrlPath.split('{{').join('`');
        requestUrlPath = requestUrlPath.split('}}').join('`');
    }

    let bodyParams = false;

/**
 * HEADER
 */
    let template = 
`
[Return](https://github.com/M2I-Group-CasparCG/CasparCGAPI/wiki/API-%7C-Home)

***
##  ${entryName}
### HTTP Request
\`${requestMethod}\` | \`${requestUrlHost}\`/${requestUrlPath}    
`

/**
 * BODY SECTION
 */
if (requestBody.raw){

        let params = JSON.parse(requestBody.raw);
        template +=
`
### BODY

#### PARAMS
`
        for (key in params){
template +=
`
> \`${key}\`
>`
        }
template +=
`
#### EXAMPLE
\`\`\`Javascript
${JSON.stringify(params).replace('{{','').replace('}}','')
    .split(',').join(',\r\n\t\t')
    .split('{').join('{\r\n\t\t')
    .split('}').join('\r\n\t}')}
\`\`\`
`

}else{
    console.log(requestMethod);
    if(requestMethod == 'POST' || requestMethod == 'PUT' ){

template +=
`
### BODY
> No body required
`
    }

}


/**
 * RETURN SECTION
 */
let responsesArray = responses || [];
if (responsesArray.length > 0){
    template +=
`
### HTTP RETURN
`
for (let n in responsesArray){

    const name = responsesArray[n].name;
    const body = responsesArray[n].body;
    
    template +=
`
#### ${name}
\`\`\`Javascript
${body
    .split(',').join(',\r\n\t\t')
    .split('{').join('{\r\n\t\t')
    .split('{\r\n\t\t}').join('{}')
}
\`\`\`
`
    }
}
   

    

return template;
}



