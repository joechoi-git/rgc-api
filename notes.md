https://d4tnwhmoaydvsrkwkjgldcyd3y0fnizu.lambda-url.us-west-2.on.aws/

sam build
sam deploy
sam deploy --guided


sam local start-api
curl http://localhost:3000/


sam init --app-template hello-world-typescript --name sam-app --package-type Zip --runtime nodejs18.x


sam init --runtime nodejs20.x --app-template quick-start-web --name web-app


sam init --runtime nodejs20.x --app-template hello-world-typescript --name sam-app-test



