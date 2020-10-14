import '@aws-cdk/assert/jest';
// @ts-ignore
import * as util from 'util'; // eslint-disable-line
import { App } from '@aws-cdk/core';
import { DbStack, VpcStack, ApiStack } from '../src/main';

test('Snapshot', () => {
  const app = new App();
  const dbStack = new DbStack(app, 'testDb');
  const vpcStack = new VpcStack(app, 'testVpc');
  const apiStack = new ApiStack(app, 'ApiVpc');

  expect(dbStack).not.toHaveResource('AWS::S3::Bucket');
  expect(vpcStack).not.toHaveResource('AWS::S3::Bucket');
  expect(vpcStack).not.toHaveResource('AWS::S3::Bucket');
  expect(app.synth().getStackArtifact(dbStack.artifactId).template).toMatchSnapshot();
  expect(app.synth().getStackArtifact(vpcStack.artifactId).template).toMatchSnapshot();
  expect(app.synth().getStackArtifact(apiStack.artifactId).template).toMatchSnapshot();
});
