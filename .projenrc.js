const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  authorAddress: "paulszabopnw@gmail.com",
  name: "vpc-export-import",
  authorName: "Paul Szabo",
  cdkVersion: "1.63.0",
  name: "integration-test",
  cdkDependencies: [
    "@aws-cdk/aws-ec2",
    "@aws-cdk/aws-apigateway",
    "@aws-cdk/aws-dynamodb",
    "@aws-cdk/aws-lambda",
    "@aws-cdk/core"
  ],
  cdkTestDependencies: [
    "@aws-cdk/assert"
  ],
  dependencies: {
    "cdk-vpc-export-import": "file:../cdk-vpc-export-import"
  },

});

project.synth();
