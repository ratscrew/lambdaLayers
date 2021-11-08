import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path'

export class LambdaLayersStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const testLayer = new lambda.LayerVersion(this, 'test-layer', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_12_X,
        lambda.Runtime.NODEJS_14_X,
      ],
      code: lambda.Code.fromAsset('./lambda_layer/nodejs'),
      description: 'test',
    });

    const otherRpoLayer = new lambda.LayerVersion(this, 'other-repo-layer', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_12_X,
        lambda.Runtime.NODEJS_14_X,
      ],
      code: lambda.Code.fromAsset('../otherRepo/nodejs'),
      description: 'test repo',
    });

    const lambdaFn = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      layers:[
        testLayer
      ]
    });
  }
}
