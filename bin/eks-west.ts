#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as ssp from '@shapirov/cdk-eks-blueprint'

import { AdminTeam } from '../lib/teams/admin-team'

const app = new cdk.App();

// Setup platform team
const platformTeam = new AdminTeam()
const teams: Array<ssp.Team> = [platformTeam];

// AddOns for the cluster.
const addOns: Array<ssp.ClusterAddOn> = [
    new ssp.NginxAddOn,
    new ssp.ArgoCDAddOn,
    new ssp.CalicoAddOn,
    new ssp.MetricsServerAddOn,
    new ssp.ClusterAutoScalerAddOn,
    new ssp.ContainerInsightsAddOn,
];

const id = 'eks-blueprint-west-1'
new ssp.EksBlueprint(app, { id, addOns, teams }, {
    env: {
        region: 'us-west-1',
        account: account
    }
});
