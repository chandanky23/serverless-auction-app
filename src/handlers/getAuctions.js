import AWS from "aws-sdk"
import middy from "@middy/core"
import httpJsonBodyParser from "@middy/http-json-body-parser"
import httpEventNormalizer from "@middy/http-event-normalizer"
import httpErrorHandler from "@middy/http-error-handler"
import createError from "http-errors"

const dynamoDB = new AWS.DynamoDB.DocumentClient()

/**
 * This is a Lambda Fucntion to get all the auctions using REST API
 * @param {*} event contains all the params, body, and header data passed while making the api call
 * @param {*} context stores the metadata of the execution of the lambda function
 *
 * The return of the lambda function needs to be a string, if an object is returned then it first needs to be stringified, else it will throw an error.
 */
async function getAuctions(event, context) {
  let auctions

  try {
    const result = await dynamoDB.scan({
      TableName: process.env.AUCTIONS_TABLE_NAME
    }).promise()

    auctions = result.Items
  }catch(err) {
    console.error(err)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auctions),
  }
}

export const handler = middy(getAuctions)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler())
