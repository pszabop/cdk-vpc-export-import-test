# API Reference

**Classes**

Name|Description
----|-----------
[VpcPortable](#vpc-export-import-vpcportable)|*No description*



## class VpcPortable  <a id="vpc-export-import-vpcportable"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IResource](#aws-cdk-core-iresource), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IConstruct](#aws-cdk-core-iconstruct), [IVpc](#aws-cdk-aws-ec2-ivpc), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IConstruct](#aws-cdk-core-iconstruct), [IResource](#aws-cdk-core-iresource)
__Extends__: [Vpc](#aws-cdk-aws-ec2-vpc)

### Initializer




```ts
new VpcPortable(scope: Construct, id: string, props?: VpcProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[VpcProps](#aws-cdk-aws-ec2-vpcprops)</code>)  *No description*
  * **cidr** (<code>string</code>)  The CIDR range to use for the VPC, e.g. '10.0.0.0/16'. __*Default*__: Vpc.DEFAULT_CIDR_RANGE
  * **defaultInstanceTenancy** (<code>[DefaultInstanceTenancy](#aws-cdk-aws-ec2-defaultinstancetenancy)</code>)  The default tenancy of instances launched into the VPC. __*Default*__: DefaultInstanceTenancy.Default (shared) tenancy
  * **enableDnsHostnames** (<code>boolean</code>)  Indicates whether the instances launched in the VPC get public DNS hostnames. __*Default*__: true
  * **enableDnsSupport** (<code>boolean</code>)  Indicates whether the DNS resolution is supported for the VPC. __*Default*__: true
  * **flowLogs** (<code>Map<string, [FlowLogOptions](#aws-cdk-aws-ec2-flowlogoptions)></code>)  Flow logs to add to this VPC. __*Default*__: No flow logs.
  * **gatewayEndpoints** (<code>Map<string, [GatewayVpcEndpointOptions](#aws-cdk-aws-ec2-gatewayvpcendpointoptions)></code>)  Gateway endpoints to add to this VPC. __*Default*__: None.
  * **maxAzs** (<code>number</code>)  Define the maximum number of AZs to use in this region. __*Default*__: 3
  * **natGatewayProvider** (<code>[NatProvider](#aws-cdk-aws-ec2-natprovider)</code>)  What type of NAT provider to use. __*Default*__: NatProvider.gateway()
  * **natGateways** (<code>number</code>)  The number of NAT Gateways/Instances to create. __*Default*__: One NAT gateway/instance per Availability Zone
  * **natGatewaySubnets** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  Configures the subnets which will have NAT Gateways/Instances. __*Default*__: All public subnets.
  * **subnetConfiguration** (<code>Array<[SubnetConfiguration](#aws-cdk-aws-ec2-subnetconfiguration)></code>)  Configure the subnets to build for each AZ. __*Default*__: The VPC CIDR will be evenly divided between 1 public and 1 private subnet per AZ.
  * **vpnConnections** (<code>Map<string, [VpnConnectionOptions](#aws-cdk-aws-ec2-vpnconnectionoptions)></code>)  VPN connections to this VPC. __*Default*__: No connections.
  * **vpnGateway** (<code>boolean</code>)  Indicates whether a VPN gateway should be created and attached to this VPC. __*Default*__: true when vpnGatewayAsn or vpnConnections is specified
  * **vpnGatewayAsn** (<code>number</code>)  The private Autonomous System Number (ASN) for the VPN gateway. __*Default*__: Amazon default ASN.
  * **vpnRoutePropagation** (<code>Array<[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)></code>)  Where to propagate VPN routes. __*Default*__: On the route tables associated with private subnets. If no private subnets exists, isolated subnets are used. If no isolated subnets exists, public subnets are used.


### Methods


#### exportToStackOutput() <a id="vpc-export-import-vpcportable-exporttostackoutput"></a>



```ts
exportToStackOutput(): void
```





#### publishStackOutput(key, value) <a id="vpc-export-import-vpcportable-publishstackoutput"></a>



```ts
publishStackOutput(key: string, value: string): void
```

* **key** (<code>string</code>)  *No description*
* **value** (<code>string</code>)  *No description*




#### publishStackOutputList(key, values) <a id="vpc-export-import-vpcportable-publishstackoutputlist"></a>



```ts
publishStackOutputList(key: string, values: Array<string>): void
```

* **key** (<code>string</code>)  *No description*
* **values** (<code>Array<string></code>)  *No description*




#### *static* getOtherStackOutput(key, otherStackName, otherStackNodeId) <a id="vpc-export-import-vpcportable-getotherstackoutput"></a>



```ts
static getOtherStackOutput(key: string, otherStackName: string, otherStackNodeId: string): string
```

* **key** (<code>string</code>)  *No description*
* **otherStackName** (<code>string</code>)  *No description*
* **otherStackNodeId** (<code>string</code>)  *No description*

__Returns__:
* <code>string</code>

#### *static* getOtherStackOutputList(key, otherStackName, otherStackNodeId) <a id="vpc-export-import-vpcportable-getotherstackoutputlist"></a>



```ts
static getOtherStackOutputList(key: string, otherStackName: string, otherStackNodeId: string): Array<string>
```

* **key** (<code>string</code>)  *No description*
* **otherStackName** (<code>string</code>)  *No description*
* **otherStackNodeId** (<code>string</code>)  *No description*

__Returns__:
* <code>Array<string></code>

#### *static* importFromStackOutput(scope, id, otherStackName, otherStackNodeId) <a id="vpc-export-import-vpcportable-importfromstackoutput"></a>



```ts
static importFromStackOutput(scope: Construct, id: string, otherStackName: string, otherStackNodeId: string): VpcPortable
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **otherStackName** (<code>string</code>)  *No description*
* **otherStackNodeId** (<code>string</code>)  *No description*

__Returns__:
* <code>[VpcPortable](#vpc-export-import-vpcportable)</code>

#### *static* mangleStackName(name) <a id="vpc-export-import-vpcportable-manglestackname"></a>



```ts
static mangleStackName(name: string): string
```

* **name** (<code>string</code>)  *No description*

__Returns__:
* <code>string</code>



