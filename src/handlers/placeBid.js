import AWS from "aws-sdk"
import createError from "http-errors"
import commonMiddleware from "../lib/commonMiddleware"
import { getAuctionById } from './getAuction'

const dynamoDB = new AWS.DynamoDB.DocumentClient()

/**
 * This is a Lambda Fucntion to get an auction by id using REST API
 * @param {*} event contains all the params, body, and header data passed while making the api call
 * @param {*} context stores the metadata of the execution of the lambda function
 *
 * The return of the lambda function needs to be a string, if an object is returned then it first needs to be stringified, else it will throw an error.
 */
async function placeBid(event, context) {
  const { id } = event.pathParameters
  const { amount } = event.body

  const auction = await getAuctionById(id)

  if(auction.status !== 'OPEN') {
    throw new createError.Forbidden('You cannot bid on a CLOSED auction')
  }

  if(amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`)
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {id},
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount
    },
    ReturnValues: 'ALL_NEW'
  }

  let updatedAuction

  try {
    const result = await dynamoDB.update(params).promise()
    updatedAuction = result.Attributes
  }catch(err) {
    console.error(err)
    throw new createError.InternalServerError(err)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  }
}

export const handler = commonMiddleware(placeBid)
