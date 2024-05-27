# url
https://v936r8sd70.execute-api.us-west-2.amazonaws.com/Prod/concepts

# initialize
sam init --app-template hello-world-typescript --name sam-app --package-type Zip --runtime nodejs18.x
sam init --runtime nodejs20.x --app-template quick-start-web --name web-app
sam init --runtime nodejs20.x --app-template hello-world-typescript --name sam-app-test

# deploy
sam build
sam deploy
sam deploy --guided

# local
sam build
sam local start-api
curl http://localhost:3000/
