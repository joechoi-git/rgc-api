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

const tableName = "sam-app-SampleTable-1R8VRLJJZASR2"; // TO DO: move this to an env variable
const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
};

/**
 * Retrieve all items in DynamoDB
 */
export const getItemsHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    if (event.httpMethod !== "GET") {
        throw new Error(`getItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    console.info("received getItems", event);

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
 * Add or update an item in DynamoDB
 */
export const postItemHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    if (event.httpMethod !== "POST") {
        throw new Error(`postItem only accepts PUT method, you tried: ${event.httpMethod} method.`);
    }
    console.info("received postItem", event);

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    const body = JSON.parse(event?.body?.toString() || "");
    const id = body.id;
    const displayName = body?.displayName || "";
    const description = body?.description || ""; // `testing description ${new Date()}`;
    const parentIds = body?.parentIds || "";
    const childIds = body?.childIds || "";
    const alternateNames = body?.alternateNames || "";
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
 * Delete an item in DynamoDB
 */
export const deleteItemHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    if (event.httpMethod !== "DELETE") {
        throw new Error(
            `deleteItem only accepts DELETE method, you tried: ${event.httpMethod} method.`
        );
    }
    console.info("received deleteItem", event);

    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.DeleteItem.html
    const body = JSON.parse(event?.body?.toString() || "");
    const id = body.id;
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
            body: JSON.stringify([err, params])
        };
    }
};
