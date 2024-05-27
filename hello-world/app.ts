import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

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
                message: "hello world! part 4!"
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

export const lambdaHandler2 = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "lambdaHandler2 hello!"
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
