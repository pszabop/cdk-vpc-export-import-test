import * as ApiGateway from '@aws-cdk/aws-apigateway';
import * as Dynamodb from '@aws-cdk/aws-dynamodb';
import * as Ec2 from '@aws-cdk/aws-ec2';
import * as Lambda from '@aws-cdk/aws-lambda';
import * as Cdk from '@aws-cdk/core';
import { VpcPortable } from 'cdk-vpc-export-import';
// @ts-ignore
import * as util from 'util'; // eslint-disable-line

// shared constants amongst all the stacks.
const dbStackName = 			'dbStack';
const vpcStackName = 			'vpcStack';
const apiStackName = 			'apiStack';
const testVpcName = 'testVpc';
const tablePrimaryKey = 'itemId';
const tableExportName = 'dynamoTableArn';

export class DbStack extends Cdk.Stack {
  constructor(scope: Cdk.Construct, id: string, props: Cdk.StackProps = {}) {
    super(scope, id, props);

    // define database resources here...

    // @see https://github.com/aws-samples/aws-cdk-examples/blob/master/typescript/api-cors-lambda-crud-dynamodb/index.ts
    const dynamoTable = new Dynamodb.Table(this, 'dynamoTable', {
      partitionKey: {
        name: tablePrimaryKey,
        type: Dynamodb.AttributeType.STRING,
      },
      tableName: 'items',

      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: Cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    new Cdk.CfnOutput(this, tableExportName, { value: dynamoTable.tableArn, exportName: tableExportName });
  }

}


export class VpcStack extends Cdk.Stack {
  constructor(scope: Cdk.Construct, id: string, props: Cdk.StackProps = {}) {
    super(scope, id, props);

    // define resources here...
    const testVpc = new VpcPortable(this, testVpcName, {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'isolated',
          subnetType: Ec2.SubnetType.ISOLATED,
        },
        {
          cidrMask: 24,
          name: 'private',
          subnetType: Ec2.SubnetType.PRIVATE,
        },
        {
          cidrMask: 24,
          name: 'public',
          subnetType: Ec2.SubnetType.PUBLIC,
        },
      ],
    });

    testVpc.exportToStackOutput();
  }
}

export class ApiStack extends Cdk.Stack {
  constructor(scope: Cdk.Construct, id: string, props: Cdk.StackProps = {}) {
    super(scope, id, props);

    //
    // import resources
    //
    const corporatedVpc = VpcPortable.importFromStackOutput(this, 'corporatedVpc', vpcStackName, testVpcName);
    console.log(`typeof: ${typeof corporatedVpc}`);

    const ddbArn = Cdk.Fn.importValue(tableExportName);
    const corporatedDynamoDbTable = Dynamodb.Table.fromTableArn(this, 'corporatedDynamoDb', ddbArn.toString());// as Dynamodb.Table;

    //
    // lambda functions for testing that when on that vpc, the lambda function can access all resources
    // The reason to test this is that if a vpc, subnet, route, or security group is messed up, Lambda cannot fetch
    // entities like DynamoDB because a subnet and a route or gateway is needed to get to dynamodb, s3, sqs, sns, etc
    //
    const getDbLambda = new Lambda.Function(this, 'getDbLambda', {
      code: new Lambda.AssetCode('lambdaSrc'),
      handler: 'get-db.handler',
      runtime: Lambda.Runtime.NODEJS_12_X,
      vpc: corporatedVpc, // TEST1: forces Lambda to not use the default VPC, use ours instead
      environment: {
        TABLE_NAME: corporatedDynamoDbTable.tableName, // TEST2: can we set the the env variable for an imported table
        PRIMARY_KEY: tablePrimaryKey,
      },
    });
    //  TEST3: can we grant permissions using an iTable
    corporatedDynamoDbTable.grantReadWriteData(getDbLambda);

    const postDbLambda = new Lambda.Function(this, 'postDbLambda', {
      code: new Lambda.AssetCode('lambdaSrc'),
      handler: 'post-db.handler',
      runtime: Lambda.Runtime.NODEJS_12_X,
      vpc: corporatedVpc, // TEST1: forces Lambda to not use the default VPC, use ours instead
      environment: {
        TABLE_NAME: corporatedDynamoDbTable.tableName, // TEST2: can we set the the env variable for an imported table
        PRIMARY_KEY: tablePrimaryKey,
      },
    });
    //  TEST3: can we grant permissions using an iTable
    corporatedDynamoDbTable.grantReadWriteData(postDbLambda);

    //
    // create test api gateway
    // <base_uril/db/id
    //
    const testApi = new ApiGateway.RestApi(this, 'testApi', {
      restApiName: 'Network Test Service',
    });
    const db = testApi.root.addResource('db'); // we will add /efs and /s3 and /sqs and /<etc> later
    const item = db.addResource('{id}'); // we will add /efs and /s3 and /sqs and /<etc> later

    const dbItemIntegration = new ApiGateway.LambdaIntegration(getDbLambda);
    item.addMethod('GET', dbItemIntegration);

    const dbCreateOneIntegration = new ApiGateway.LambdaIntegration(postDbLambda);
    item.addMethod('POST', dbCreateOneIntegration);
    // skipped because we aren't using a browser to test: addCorsOptions(items);

    // we are going to need the URL in order to test this thing
    new Cdk.CfnOutput(this, 'testApiGatewayInvokeUrl', { value: testApi.url });
    new Cdk.CfnOutput(this, 'getLambdaArn', { value: getDbLambda.functionArn });
    new Cdk.CfnOutput(this, 'postLambdaArn', { value: postDbLambda.functionArn });

    // wouldn't it be nice to do this:
    // ourCftOutItems.push(corporatedDynamoDbTable);
    // ourCftOuutItems.push(getDbLambda);
    // ...
    // ourCftOutItems.forEach(el => {
    //   new Cdk.CfnOutput(this, el.node.name + 'Arn',
    // });

  }
}
// for development, use account/region from cdk cli
//
/*
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};
*/

const app = new Cdk.App();

new DbStack(app, dbStackName);
new VpcStack(app, vpcStackName);
new ApiStack(app, apiStackName);
//new VpcStack(app, 'my-stack-dev', { env: devEnv });
// new VpcStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();
