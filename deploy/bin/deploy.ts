#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Web } from "../lib/web";
import {
  OwnerTag,
  CriticalityTag,
  DataClassificationTag,
  DataComplianceTag,
} from "nbit-cdk-construct-library";

const app = new cdk.App();
new Web(app, "counter-terminal-web", {
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
  },
  tags: {
    "git-repository": "spm",
    "git-repository-path": "apps/counter-terminal/deploy",
    owner: OwnerTag.CounterTerminal,
    app: "counter-terminal",
    criticality: CriticalityTag.Low,
    "data-classification": DataClassificationTag.Internal,
    "data-compliance": DataComplianceTag.None,
  },
});
