import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    PutCommand,
    ScanCommand
} from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = "sam-app-SampleTable-1R8VRLJJZASR2"; // process.env.SAMPLE_TABLE;
const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
};

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
export const getAllItemsHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
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
            headers: headers,
            statusCode: 200,
            body: JSON.stringify(items)
        };
        console.info(
            `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
        );
        return response;
    } catch (err) {
        console.error("Error", err);
        return {
            headers: headers,
            statusCode: 400,
            body: JSON.stringify(err)
        };
    }
};

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const postItemHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    if (event.httpMethod !== "POST") {
        throw new Error(`postItem only accepts PUT method, you tried: ${event.httpMethod} method.`);
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
            headers: headers,
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
            headers: headers,
            statusCode: 400,
            body: JSON.stringify(err)
        };
    }
};

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const deleteItemHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    if (event.httpMethod !== "DELETE") {
        throw new Error(
            `deleteItem only accepts DELETE method, you tried: ${event.httpMethod} method.`
        );
    }
    console.info("received:", event);

    // Get id and name from the body of the request
    const body = JSON.parse(event?.body?.toString() || "");
    const id = body.id;

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    const params = {
        TableName: tableName,
        Key: {
            id: id
        }
    };

    try {
        const data = await ddbDocClient.send(new DeleteCommand(params));
        console.log("Success - item deleted", data);
        const response = {
            headers: headers,
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
            headers: headers,
            statusCode: 400,
            body: JSON.stringify(err)
        };
    }
};
