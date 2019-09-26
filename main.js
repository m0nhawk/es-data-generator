#!/usr/bin/env node

'use strict'

const program = require('commander');
const { Client } = require('@elastic/elasticsearch');
const { resolve } = require('json-schema-faker');
const { chunkArray } = require('./src/tools');
const { faker_type } = require('./src/types');

program
    .option('-v, --verbose', 'verbose output')
    .option('-h, --hostname <hostname>', 'elasticsearch hostname', 'http://localhost')
    .option('-p, --port <port>', 'elasticsearch port', '9200')
    .option('-i, --index <index>', 'elasticsearch index')
    .option('-n, --number <number>', 'number of documents to generate', 100)
    .option('-r, --random', 'generate random number of document up to "number"', false);

program.parse(process.argv);

// console.log(program);

const es_host = `${program.hostname}:${program.port}`;
const es_index = program.index;

// https://github.com/json-schema-faker/json-schema-faker
// https://json-schema.org/understanding-json-schema/reference/array.html

const client = new Client({ node: es_host });

var min, max;

if (program.random) {
    min = 1;
    max = program.number;
} else {
    min = program.number;
    max = program.number;
}

const schema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
        },
        required: [],
    },
    minItems: min,
    maxItems: max,
}

async function run() {
    var mapping = await client.indices.getMapping({ index: es_index });

    for (const [key, value] of Object.entries(mapping.body[es_index].mappings.properties)) {
        var fieldType = faker_type(value);
        schema.items.properties[key] = fieldType;
        schema.items.required.push(key);
    }

    var sample = await resolve(schema);

    const body = sample.flatMap(doc => [{ index: { _index: es_index } }, doc]);
    // const body = sample.flatMap(doc => [{ index: { _index: es_index, _type: 'patients' } }, doc]);

    const chunks = chunkArray(body, 1000);

    for (const body of chunks) {
        console.log("Chunk...")
        const { body: bulkResponse } = await client.bulk({ refresh: true, body })

        if (bulkResponse.errors) {
            const erroredDocuments = []
            // The items array has the same order of the dataset we just indexed.
            // The presence of the `error` key indicates that the operation
            // that we did for the document has failed.
            bulkResponse.items.forEach((action, i) => {
                const operation = Object.keys(action)[0]
                if (action[operation].error) {
                    erroredDocuments.push({
                        // If the status is 429 it means that you can retry the document,
                        // otherwise it's very likely a mapping error, and you should
                        // fix the document before to try it again.
                        status: action[operation].status,
                        error: action[operation].error,
                        operation: body[i * 2],
                        document: body[i * 2 + 1]
                    })
                }
            })
            console.log(erroredDocuments)
        }

        const { body: count } = await client.count({ index: es_index });
        console.log(count);
    };
}

run().catch(function (error) {
    console.log(error);
});
