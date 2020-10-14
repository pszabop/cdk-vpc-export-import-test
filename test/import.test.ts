import * as util from 'util';
//import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { VpcPortable } from '../src';

test('imports correctly', () => {

  const mockApp = new cdk.App();
  const stack = new cdk.Stack(mockApp, 'import-testing-stack');

  const importedVpc: VpcPortable = VpcPortable.importFromStackOutput(stack, 'otherStacksVpc', 'testing-stack', 'testVpc');
  console.log(`typeof: ${typeof importedVpc}`);

  console.log(util.inspect(importedVpc));

  const mockCloudAssembly = mockApp.synth({ force: true });

  const stackArtifact = mockCloudAssembly.getStackArtifact(stack.artifactId);

  console.log(util.inspect(mockCloudAssembly.tree(), false, 8));

  const outputNames = Object.keys(stackArtifact.manifest.metadata || []).map(el => {
    //console.log(util.inspect(el));
    return el;
  });
  console.log(util.inspect(outputNames));

  // why doesn't this work? importedVpc.exportToStackOutput();

});
