'use strict'

const jsf = require('json-schema-faker')
const https = require('https')

const fs = require('fs')

var schema = https.get('https://s3.amazonaws.com/dictionary-artifacts/datadictionary/develop/schema.json', function(res) {
	let data = '', json_data;

	res.on('data', function(stream) {
		data += stream;
	});
	res.on('end', function() {
        json_data = JSON.parse(data);
        // will output a Javascript object
        console.log(json_data);

        for (const [key, value] of Object.entries(json_data)) {
            fs.writeFileSync('schemas/' + key, JSON.stringify(value, null, 2))
        }

        jsf.resolve(json_data['project.yaml'], null, 'schemas').then(sample => {
            console.log(sample);
        });
	});
})

// console.log(schema)
