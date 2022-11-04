const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = "Customer_Information";
const healthPath = "/healthcheck";
const customerPath = "/customer";
const getcustomersPath = "/getcustomers";

exports.handler = async function (event) {
  console.log("Request event : ", event);
  console.log("Request event queryparams: ", event.queryStringParameters);
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === healthPath:
      response = buildResponse(200);
      break;
    case event.httpMethod === "GET" && event.path === customerPath:
      response = await getCustomer(event.queryStringParameters.id);
      break;
    case event.httpMethod === "GET" && event.path === getcustomersPath:
      response = await getCustomers();
      break;
    default:
      response = buildResponse(404, "NotFound !!!!!");
  }
  return response;
};

async function getCustomer(customerId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      Customerid: Number(customerId),
    },
  };
  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        console.log(" responseeee ", response);
        return buildResponse(200, response.Item);
      },
      (error) => {
        console.error("Error in getCustomer() . . ", error);
      }
    );
}

async function getCustomers() {
  const params = {
    TableName: dynamodbTableName,
  };
  const allCustomers = await scanDynamoRecords(params, []);
  const body = {
    customers: allCustomers,
  };
  return buildResponse(200, body);
}

async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch (error) {
    console.error(" Error in scanDynamoRecords() . . ", error);
  }
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}
