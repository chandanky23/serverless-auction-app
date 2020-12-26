const schema = {
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          types: 'string',
          enum: ['OPEN', 'CLOSED'],
          default: 'OPEN'
        }
      }
    }
  },
  required: [
    'queryStringParameters'
  ]
}

export default schema