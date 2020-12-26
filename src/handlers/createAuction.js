import { v4 as uuid } from "uuid"
import AWS from "aws-sdk"
import createError from "http-errors"
import validator from "@middy/validator"
import commonMiddleware from "../lib/commonMiddleware"
import createAuctionSchema from "../lib/schemas/createAuction"

const dynamoDB = new AWS.DynamoDB.DocumentClient()

/**
 * This is a Lambda Fucntion to create an aution using REST API
 * @param {*} event contains all the params, body, and header data passed while making the api call
 * @param {*} context stores the metadata of the execution of the lambda function
 *
 * The return of the lambda function needs to be a string, if an object is returned then it first needs to be stringified, else it will throw an error.
 */
async function createAuction(event, context) {
  const { title } = event.body
  const now = new Date()
  const endDate = new Date()
  endDate.setHours(now.getHours() + 1)

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
  }

  try {
    await dynamoDB
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise()
  } catch (err) {
    console.error(err)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  }
}

export const handler = commonMiddleware(createAuction).use(
  validator({ inputSchema: createAuctionSchema })
)
