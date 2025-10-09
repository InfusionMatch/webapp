import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { CfnBucket } from 'aws-cdk-lib/aws-s3';

const backend = defineBackend({
  auth,
  data,
  storage
});

// HIPAA: Enable encryption and audit logging
const dataResources = backend.data.resources;

// Enable X-Ray tracing for API requests (audit trail)
dataResources.cfnResources.cfnGraphqlApi.xrayEnabled = true;

// Enable CloudWatch logging
dataResources.cfnResources.cfnGraphqlApi.logConfig = {
  cloudWatchLogsRoleArn: dataResources.cfnResources.amplifyDynamoDbTablesRole.attrArn,
  fieldLogLevel: 'ALL',
  excludeVerboseContent: false
};

// HIPAA: S3 bucket encryption and versioning
const s3Bucket = backend.storage.resources.bucket;

// Access the underlying CfnBucket to use addPropertyOverride
const cfnBucket = s3Bucket.node.defaultChild as CfnBucket;

// Enable server-side encryption
cfnBucket.addPropertyOverride('BucketEncryption', {
  ServerSideEncryptionConfiguration: [
    {
      ServerSideEncryptionByDefault: {
        SSEAlgorithm: 'AES256'
      },
      BucketKeyEnabled: true
    }
  ]
});

// Enable versioning for audit trail
cfnBucket.addPropertyOverride('VersioningConfiguration', {
  Status: 'Enabled'
});

// Enable lifecycle rules for old versions
cfnBucket.addPropertyOverride('LifecycleConfiguration', {
  Rules: [
    {
      Id: 'DeleteOldVersions',
      Status: 'Enabled',
      NoncurrentVersionExpiration: {
        NoncurrentDays: 90
      }
    }
  ]
});

// Block public access
cfnBucket.addPropertyOverride('PublicAccessBlockConfiguration', {
  BlockPublicAcls: true,
  BlockPublicPolicy: true,
  IgnorePublicAcls: true,
  RestrictPublicBuckets: true
});
