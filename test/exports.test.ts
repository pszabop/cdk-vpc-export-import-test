import * as util from 'util';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { VpcPortable } from '../src';

test('exports correctly', () => {

  const mockApp = new cdk.App();
  const stack = new cdk.Stack(mockApp, 'testing-stack');

  const testVpc = new VpcPortable(stack, 'testVpc', {
    subnetConfiguration: [
      {
        cidrMask: 22,
        name: 'isolated',
        subnetType: ec2.SubnetType.ISOLATED,
      },
      {
        cidrMask: 22,
        name: 'private',
        subnetType: ec2.SubnetType.PRIVATE,
      },
      {
        cidrMask: 22,
        name: 'public',
        subnetType: ec2.SubnetType.PUBLIC,
      },
    ],
  });

  console.log(testVpc.vpcId);

  testVpc.exportToStackOutput();

  const mockCloudAssembly = mockApp.synth({ force: true });

  const stackArtifact = mockCloudAssembly.getStackArtifact(stack.artifactId);

  console.log(util.inspect(mockCloudAssembly.tree(), false, 8));

  const outputNames = Object.keys(stackArtifact.manifest.metadata || []).map(el => {
    //console.log(util.inspect(el));
    return el;
  });
  console.log(util.inspect(outputNames));


});
