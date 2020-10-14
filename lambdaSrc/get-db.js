const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

exports.handler = async (event) => {

  if (!TABLE_NAME) {
    return { statusCode: 400, body: 'environment variable TABLE_NAME not set' };
  }
  if (!PRIMARY_KEY) {
    return { statusCode: 400, body: 'environment variable PRIMARY_KEY not set' };
  }
  if (!event.pathParameters)  {
    return { statusCode: 400, body: `Error: You have no path paraemters at all` };
  }

  const requestedItemId = event.pathParameters.id;
  if (!requestedItemId) {
    return { statusCode: 400, body: `Error: You are missing the path parameter id` };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      [PRIMARY_KEY]: requestedItemId
    }
  };

  try {
    const response = await db.get(params).promise();
    return { statusCode: 200, body: JSON.stringify(response.Item) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
