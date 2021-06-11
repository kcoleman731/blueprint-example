import * as cdk from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as actions from '@aws-cdk/aws-codepipeline-actions';
import * as ssp from '@shapirov/cdk-eks-blueprint'

// Team implementations
import { AdminTeam } from '../teams/admin-team'

export default class PipelineStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const pipeline = this.buildPipeline(this)

        // Dev cluster.
        const stageOpts = { manualApprovals: true }
        const stage1 = new ClusterStage(this, 'blueprint-dev')
        pipeline.addApplicationStage(stage1, stageOpts);
    }

    private buildPipeline = (scope: cdk.Stack) => {
        const sourceArtifact = new codepipeline.Artifact();
        const cloudAssemblyArtifact = new codepipeline.Artifact();

        const sourceAction = new actions.GitHubSourceAction({
            actionName: 'GitHub',
            output: sourceArtifact,
            owner: 'kcoleman731',
            repo: 'blueprint-example',
            branch: 'main',
            oauthToken: cdk.SecretValue.plainText('ENTER_HERE'),
        })

        // Use this if you need a build step (if you're not using ts-node
        // or if you have TypeScript Lambdas that need to be compiled).
        const synthAction = pipelines.SimpleSynthAction.standardNpmSynth({
            sourceArtifact,
            cloudAssemblyArtifact,
            buildCommand: 'npm run build',
        })

        return new pipelines.CdkPipeline(scope, 'FactoryPipeline', {
            pipelineName: 'FactoryPipeline',
            cloudAssemblyArtifact,
            sourceAction,
            synthAction,
        });
    }
}

export class ClusterStage extends cdk.Stage {
    constructor(scope: cdk.Stack, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        // Setup platform team
        const accountID = process.env.CDK_DEFAULT_ACCOUNT!
        const platformTeam = new AdminTeam(accountID!)
        const teams: Array<ssp.Team> = [platformTeam];

        // AddOns for the cluster.
        const addOns: Array<ssp.ClusterAddOn> = [
            new ssp.NginxAddOn,
            new ssp.ArgoCDAddOn,
            new ssp.CalicoAddOn,
            new ssp.MetricsServerAddOn,
            new ssp.ClusterAutoScalerAddOn,
            // new ssp.ContainerInsightsAddOn,
        ];
        new ssp.EksBlueprint(this, { id: 'eks', addOns, teams }, props);
    }
}