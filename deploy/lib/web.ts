import {
  aws_cloudfront,
  aws_cloudfront as cloudfront,
  aws_iam as iam,
  aws_s3 as s3,
  aws_s3_deployment as s3deploy,
  CfnOutput,
  RemovalPolicy,
  Tags,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { S3Bucket, NBITStack, NBITStackProps } from "nbit-cdk-construct-library";

export class Web extends NBITStack {
  constructor(scope: Construct, id: string, props: NBITStackProps) {
    super(scope, id, props);

    // contexts
    const envtype = this.node.tryGetContext("envtype");
    const isProd: boolean = this.node.tryGetContext("isProd") === "true";
    const isFirstRelease: boolean = this.node.tryGetContext("isFirstRelease") === "true";
    if (isProd) {
      throw new Error("can't be deployed to a prod environment");
    }

    Tags.of(this).add("owner", "SPM");
    Tags.of(this).add("cost-centre", "TBC");
    Tags.of(this).add("data-compliance", "pci-dss");
    Tags.of(this).add("data-classification", "strictly-confidential");
    Tags.of(this).add("environment", envtype);

    const app = {
      name: "counterterminal",
      path: "../build",
    };

    // bucket
    const bucket = new S3Bucket(this, `${app.name}-deployment-bucket`, {
      bucketName: `spm-simulator-${app.name}-web-assets-${envtype}`,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
      encryption: s3.BucketEncryption.S3_MANAGED,
      serverAccessLogsBucket: s3.Bucket.fromBucketName(
        this,
        `${id}-s3-buckets-access-logging`,
        `infrastructure-environment-s3-access-log-${envtype}`,
      ),
      serverAccessLogsPrefix: `${app.name}-deployment-bucket`,
    });

    // cloudfront
    let cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, `${app.name}-OAI`, {
      comment: `OAI for ${bucket.bucketArn} app bucket`,
    });

    const cloudfrontS3Access = new iam.PolicyStatement();

    cloudfrontS3Access.addActions("s3:GetBucket*");
    cloudfrontS3Access.addActions("s3:GetObject*");
    cloudfrontS3Access.addActions("s3:List*");
    cloudfrontS3Access.addResources(bucket.bucketArn);
    cloudfrontS3Access.addResources(`${bucket.bucketArn}/*`);

    cloudfrontS3Access.addCanonicalUserPrincipal(
      cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId,
    );

    bucket.addToResourcePolicy(cloudfrontS3Access);

    new StringParameter(this, `${id}-OAI-counterterminal-name-param`, {
      parameterName: `counterterminal-web-OAI-counterterminal-name`,
      description: `OAI for ${bucket.bucketArn} app bucket name`,
      stringValue: cloudFrontOAI.originAccessIdentityName,
    });

    if (isFirstRelease) {
      return;
    }

    const simulatorDistributionId = StringParameter.valueFromLookup(
      this,
      "spm-simulator-distribution-id-param",
    );
    const simulatorDistributionDomainName = StringParameter.valueForStringParameter(
      this,
      "spm-simulator-distribution-domain-name-param",
    );

    // bucket deploy
    new s3deploy.BucketDeployment(this, `deploy-with-invalidation-${app.name}`, {
      sources: [s3deploy.Source.asset(app.path)],
      destinationBucket: bucket,
      destinationKeyPrefix: `apps/${app.name}/`,
      distribution: aws_cloudfront.Distribution.fromDistributionAttributes(
        this,
        "simulator-distribution",
        {
          distributionId: simulatorDistributionId,
          domainName: simulatorDistributionDomainName,
        },
      ),
      // serverSideEncryption: aws_s3_deployment.ServerSideEncryption.AES_256,
      distributionPaths: ["/apps/counterterminal/*"],
      memoryLimit: 1024,
    });

    new CfnOutput(this, `${id}-OAI-name-out`, {
      value: cloudFrontOAI.originAccessIdentityName,
    });
  }
}
