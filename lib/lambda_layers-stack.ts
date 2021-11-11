import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';

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
      code: lambda.Code.fromAsset('./otherRepo/nodejs'),
      description: 'test otherRepo',
    });

    const npmTestLayer = new lambda.LayerVersion(this, 'npm-test-layer', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_12_X,
        lambda.Runtime.NODEJS_14_X,
      ],
      code: lambda.Code.fromAsset('./lambda_layer'),
      description: 'npm test repo',
    });

    const lambdaFn = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      layers:[
        testLayer,
        otherRpoLayer,
        npmTestLayer
      ]
    });

    // const lambda2Fn = new lambda.Function(this, 'MyFunction2', {
    //   runtime: lambda.Runtime.NODEJS_12_X,
    //   handler: 'index.handler',
    //   code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
    //   layers:[
    //     testLayer,
    //     //otherRpoLayer
    //   ]
    // });



    const lambdaTarget = new LambdaFunction(lambdaFn,{
      retryAttempts:2
    })

    // const lambdaTarget2 = new LambdaFunction(lambda2Fn,{
    //   retryAttempts:3
    // })

    new Rule(this, 'ScheduleRule1', {
      schedule: Schedule.cron({ }),
      targets: [lambdaTarget],
     });

    //  new Rule(this, 'ScheduleRule2', {
    //   schedule: Schedule.cron({ }),
    //   targets: [lambdaTarget2],
    //  });


  }
}
