/**
 * This is a Lambda Fucntion to create an aution using REST API
 * @param {*} event contains all the params, body, and header data passed while making the api call
 * @param {*} context stores the metadata of the execution of the lambda function
 *
 * The return of the lambda function needs to be a string, if an object is returned then it first needs to be stringified, else it will throw an error.
 */
async function createAuction(event, context) {
  const { title } = JSON.parse(event.body)
  const now = new Date()

  const auction = {
    title,
    status: 'OPEN',
    createdAt: now.toISOString()
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  }
}

export const handler = createAuction
