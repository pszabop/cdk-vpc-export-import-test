# AWS CDK Construct - export VPC from one stack, import to another
This is an integration test for the NPM module `cdk-vpc-export-import`.

It also demonstrates how to use multiple stacks to modularize your AWS deployments
so that faults in the CDK are isolated to one stack


# Testing

## Integration Test
This needs to be automated.  Why the CDK CLI doesn't have a wrapper NPM package by now, I have no idea.
I guess that should be next on the list of things I should write.

1. Run the build command. This will cause a synthesis of the stack and unit tests for the stack to run

        yarn run build

1. Build the lambda code.  AFAICT no toolchain handles this correctly

        cd lambdaSrc
        npm install
        cd ..

1. Run the deploy commands for the two stacks.  Assumes you have the environment variables or ~/.aws/credentials file mounted

        yarn run deploy dbStack
        yarn run deploy vpcStack 
        yarn run deploy apiStack

1. Get the URL for the api gateway in the stack output via copy and paste into the next commands

1. Run the integration test that tests the network connectivity by doing a POST and a GET.  Make not of the ID for the GET

        curl -X POST -H "Content-Type: application/json" -d '{"username":"xyz","email":"xyz@example.com"}' <apigatewayurl>/db/id
        curl -s <apigatewayurl>/prod/db/<id returned from the POST>

1. destroy the two stacks.  Note the reverse order due to dependencies

        yarn run cdk destroy apiStack
        yarn run cdk destroy vpcStack
        yarn run cdk destroy apiStack


