import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = "sam-app-SampleTable-1R8VRLJJZASR2"; // process.env.SAMPLE_TABLE;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "hello world! 5!"
            })
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "some error happened"
            })
        };
    }
};

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
export const getAllItemsHandler = async (event: APIGatewayProxyEvent) => {
    if (event.httpMethod !== "GET") {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    console.info("received:", event);

    // get all items from the table (only first 1MB data, you can use `LastEvaluatedKey` to get the rest of data)
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
    const params = {
        TableName: tableName
    };

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        const items = data.Items;
        const response = {
            statusCode: 200,
            /*
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            }, */
            body: JSON.stringify(items)
        };
        console.info(
            `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
        );
        return response;
    } catch (err) {
        console.error("Error", err);
        return {
            statusCode: 400,
            body: JSON.stringify(err)
        };
    }
};

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const postItemHandler = async (event: APIGatewayProxyEvent) => {
    if (event.httpMethod !== "POST") {
        throw new Error(
            `putMethod only accepts PUT method, you tried: ${event.httpMethod} method.`
        );
    }
    console.info("received:", event);

    // Get id and name from the body of the request
    const body = JSON.parse(event?.body?.toString() || "");
    const id = body.id;
    const displayName = body?.displayName || "";
    const description = body?.description || ""; // `testing description ${new Date()}`;
    const parentIds = body?.parentIds || "";
    const childIds = body?.childIds || "";
    const alternateNames = body?.alternateNames || "";

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    const params = {
        TableName: tableName,
        Item: {
            id: id,
            displayName: displayName,
            description: description,
            parentIds: parentIds,
            childIds: childIds,
            alternateNames: alternateNames
        }
    };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
        const response = {
            statusCode: 200,
            body: JSON.stringify(body)
        };
        console.info(
            `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
        );
        return response;
    } catch (err) {
        console.error("Error", err);
        return {
            statusCode: 400,
            body: JSON.stringify(err)
        };
    }
};
