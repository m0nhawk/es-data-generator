function faker_type(value) {
    var fieldType
    switch (value.type) {
        case "boolean":
            fieldType = { type: "boolean" }
            break;
        case "keyword":
            fieldType = { type: "string", faker: "name.findName" }
            break;
        case "text":
            fieldType = { type: "string", faker: "name.findName" }
            break;
        case "double":
            fieldType = { type: "number" }
            break;
        case "long":
            fieldType = { type: "integer" }
            break;
        case "nested":
            var properties = {}
            var required = []
            for (const [key, v] of Object.entries(value.properties)) {
                properties[key] = faker_type(v)
                required.push(key)
            }
            fieldType = { type: "array", items: { type: "object", properties: properties, required: required }, minItems: 10, maxItems: 10 }
            break;
        default:
            break;
    }
    return fieldType
}

module.exports = {
    faker_type: faker_type,
}
