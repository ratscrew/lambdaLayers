import * as pipelines from '@aws-cdk/pipelines'
import * as cdk from '@aws-cdk/core';
import { LambdaLayersStack } from './lambda_layers-stack'


interface myprops extends cdk.StackProps{
  type:string
}

export class MyPipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: myprops) {
      super(scope, id, props);
  
      const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
        selfMutation:true,
        synth: new pipelines.ShellStep('Synth', {
          // Use a connection created using the AWS console to authenticate to GitHub
          // Other sources are available.
          input: pipelines.CodePipelineSource.connection('ratscrew/lambdaLayers', props?.type == "prod"? 'master' : 'dev', {
            connectionArn: 'arn:aws:codestar-connections:eu-west-1:453380824957:connection/d20353d2-91a7-447a-905c-9c0c36de7dc6', // Created using the AWS console * });',
          }),
          additionalInputs:{
            otherRepo: pipelines.CodePipelineSource.connection('ratscrew/testLayer', 'main', {
              connectionArn: 'arn:aws:codestar-connections:eu-west-1:453380824957:connection/d20353d2-91a7-447a-905c-9c0c36de7dc6', // Created using the AWS console * });',
            })
          },
          commands: [
            'cd lambda_layer',
            'npm i',
            'cd..',
            'npm ci',
            'npm run build',
            'npx cdk synth',
          ],
        }),
      });
  
      // 'MyApplication' is defined below. Call `addStage` as many times as
      // necessary with any account and region (may be different from the
      // pipeline's).
      pipeline.addStage(new MyApplication(this, 'Prod', { 
        env:  { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION, db:"" },
      }));

    }
  }
  


  /**
   * Your application
   *
   * May consist of one or more Stacks (here, two)
   *
   * By declaring our DatabaseStack and our ComputeStack inside a Stage,
   * we make sure they are deployed together, or not at all.
   */
  class MyApplication extends cdk.Stage {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
      super(scope, id, props);
  
      const lambdaLayersStack = new LambdaLayersStack(this, 'lambdaLayersStack',{
          env:  { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
      });

    }
  }