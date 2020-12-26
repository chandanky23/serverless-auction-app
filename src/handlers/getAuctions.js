import AWS from "aws-sdk"
import createError from "http-errors"
import commonMiddleware from "../lib/commonMiddleware"

const dynamoDB = new AWS.DynamoDB.DocumentClient()

/**
 * This is a Lambda Fucntion to get all the auctions using REST API
 * @param {*} event contains all the params, body, and header data passed while making the api call
 * @param {*} context stores the metadata of the execution of the lambda function
 *
 * The return of the lambda function needs to be a string, if an object is returned then it first needs to be stringified, else it will throw an error.
 */
async function getAuctions(event, context) {
  
  const {status} = event.queryStringParameters
  let auctions

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status
    },
    ExpressionAttributeNames: {
      '#status': 'status'
    }
  }

  try {
    const result = await dynamoDB.query(params).promise()
    auctions = result.Items
  } catch (err) {
    console.error(err)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  }
}

export const handler = commonMiddleware(getAuctions)
