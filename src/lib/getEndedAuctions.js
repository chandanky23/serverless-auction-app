import AWS from "aws-sdk"

const dynamoDB = new AWS.DynamoDB.DocumentClient()

export const getEndedAuctions = async () => {
  const now = new Date()
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ':now': now.toISOString(),
    },
    ExpressionAttributeNames: {
      // Since status is a reserved word in dynamoDB, for work around we use this ExpressionAttributeNames to replace the reserved word.
      "#status": "status",
    },
  }
  const result = await dynamoDB.query(params).promise()

  return result.Items
}
