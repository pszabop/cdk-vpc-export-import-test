import * as Ec2 from '@aws-cdk/aws-ec2';
import * as Cdk from '@aws-cdk/core';

export class VpcPortable extends Ec2.Vpc {


  static mangleStackName(name: string) {
    return name.replace(/-|\s/g, '');
  }

  static getOtherStackOutput(key: string, otherStackName: string, otherStackNodeId: string): string {
    const globallyUniqueKeyExport = `${VpcPortable.mangleStackName(otherStackName)}-${otherStackNodeId}-${key}`;
    const result = Cdk.Fn.importValue(globallyUniqueKeyExport);
    return result;
  }

  static getOtherStackOutputList(key: string, otherStackName: string, otherStackNodeId: string): string[] {
    const globallyUniqueKeyExport = `${VpcPortable.mangleStackName(otherStackName)}-${otherStackNodeId}-${key}`;
    const marshalledResult = Cdk.Fn.importValue(globallyUniqueKeyExport);
    const result = Cdk.Fn.split(',', marshalledResult);
    return result;
  }

  /**
   * @brief fromVpcAttributes() that fetches the attributes using a naming convetion for stack
   * export/import.
   */
  static importFromStackOutput(scope: Cdk.Construct, id: string, otherStackName:string, otherStackNodeId: string): VpcPortable {

    // get the exported outputs from the other stack
    const vpcId = VpcPortable.getOtherStackOutput('vpcId', otherStackName, otherStackNodeId);
    const availabilityZones = VpcPortable.getOtherStackOutputList('availabilityZones', otherStackName, otherStackNodeId);
    const isolatedSubnets = VpcPortable.getOtherStackOutputList('isolatedSubnets', otherStackName, otherStackNodeId);
    const privateSubnets = VpcPortable.getOtherStackOutputList('privateSubnets', otherStackName, otherStackNodeId);
    const publicSubnets = VpcPortable.getOtherStackOutputList('publicSubnets', otherStackName, otherStackNodeId);
    const isolatedRouteTableIds = VpcPortable.getOtherStackOutputList('isolatedRouteTableIds', otherStackName, otherStackNodeId);
    const privateRouteTableIds = VpcPortable.getOtherStackOutputList('privateRouteTableIds', otherStackName, otherStackNodeId);
    const publicRouteTableIds = VpcPortable.getOtherStackOutputList('publicRouteTableIds', otherStackName, otherStackNodeId);

    const importedVpc = Ec2.Vpc.fromVpcAttributes(scope, id, {
      vpcId: vpcId,
      availabilityZones: availabilityZones,
      isolatedSubnetIds: isolatedSubnets,
      privateSubnetIds: privateSubnets,
      publicSubnetIds: publicSubnets,
      isolatedSubnetRouteTableIds: isolatedRouteTableIds,
      privateSubnetRouteTableIds: privateRouteTableIds,
      publicSubnetRouteTableIds: publicRouteTableIds,
    }) as VpcPortable;

    return importedVpc;
  }


  constructor(scope: Cdk.Construct, id: string, props?: Ec2.VpcProps) {
    super(scope, id, props);
  }

  /**
   * @brief publish a legal stack list output with globally unique key
   */
  publishStackOutputList(key: string, values: string[]) {

    const globallyUniqueKeyExport = `${VpcPortable.mangleStackName(this.stack.stackName)}-${this.node.id}-${key}`;
    const marshalledStringList = values.join(',');
    new Cdk.CfnOutput(this.stack, globallyUniqueKeyExport, {
      value: marshalledStringList,
      exportName: globallyUniqueKeyExport,
    });
  }

  /**
   * @brief publish a legal stack output with globally unique key
   */
  publishStackOutput(key: string, value: string) {
    const globallyUniqueKeyExport = `${VpcPortable.mangleStackName(this.stack.stackName)}-${this.node.id}-${key}`;
    new Cdk.CfnOutput(this.stack, globallyUniqueKeyExport, {
      value: value,
      exportName: globallyUniqueKeyExport,
    });
  }


  /**
   * @brief export Vpc and all components as stack output
   */
  exportToStackOutput() {

    // grab all the subnet IDs
    const isolatedSubnets = this.selectSubnets({
      subnetType: Ec2.SubnetType.ISOLATED,
    });
    const privateSubnets = this.selectSubnets({
      subnetType: Ec2.SubnetType.PRIVATE,
    });
    const publicSubnets = this.selectSubnets({
      subnetType: Ec2.SubnetType.PUBLIC,
    });

    // from subnets, grab all the route tables
    const isolatedRouteTableIds = this.isolatedSubnets.map((el: Ec2.ISubnet) => {
      return el.routeTable.routeTableId;
    });
    const privateRouteTableIds = this.privateSubnets.map((el: Ec2.ISubnet) => {
      return el.routeTable.routeTableId;
    });
    const publicRouteTableIds = this.publicSubnets.map((el: Ec2.ISubnet) => {
      return el.routeTable.routeTableId;
    });

    // Get the AZs
    const azs = this.availabilityZones;

    // publish
    this.publishStackOutput('vpcId', this.vpcId);
    this.publishStackOutputList('availabilityZones', azs);
    this.publishStackOutputList('isolatedSubnets', isolatedSubnets.subnetIds);
    this.publishStackOutputList('privateSubnets', privateSubnets.subnetIds);
    this.publishStackOutputList('publicSubnets', publicSubnets.subnetIds);
    this.publishStackOutputList('isolatedRouteTableIds', isolatedRouteTableIds);
    this.publishStackOutputList('privateRouteTableIds', privateRouteTableIds);
    this.publishStackOutputList('publicRouteTableIds', publicRouteTableIds);


  }

}
