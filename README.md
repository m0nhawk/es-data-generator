# `es-data-generator`

`es-data-generator` is using Elasticsearch index mapping to generate documents and index them.

## Usage

```
➜ ./main.js --help
Usage: main [options]

Options:
  -v, --verbose                verbose output
  -h, --hostname <hostname>    elasticsearch hostname (default: "http://localhost")
  -p, --port <port>            elasticsearch port (default: "9200")
  -i, --index <index>          elasticsearch index
  -d, --doc_type <doc_type>    document type (default: null)
  --field_value <field_value>  field value (default: null)
  -n, --number <number>        number of documents to generate (default: 100)
  -r, --random                 generate random number of document up to "number" (default: false)
  -h, --help                   output usage information
```

## Issue tracker

Please report any bugs and enhancement ideas using the `es-data-generator` issue tracker:

  https://github.com/m0nhawk/es-data-generator/issues

Feel free to also ask questions on the tracker.

## License

`es-data-generator` is licensed under the terms of the MIT License (see the file [LICENSE](LICENSE)).
