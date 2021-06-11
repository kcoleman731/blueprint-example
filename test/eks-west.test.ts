import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as EksWest from '../lib/eks-west-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new EksWest.EksWestStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
