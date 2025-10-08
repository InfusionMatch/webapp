import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

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

// Enable server-side encryption
s3Bucket.addPropertyOverride('BucketEncryption', {
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
s3Bucket.addPropertyOverride('VersioningConfiguration', {
  Status: 'Enabled'
});

// Enable lifecycle rules for old versions
s3Bucket.addPropertyOverride('LifecycleConfiguration', {
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
s3Bucket.addPropertyOverride('PublicAccessBlockConfiguration', {
  BlockPublicAcls: true,
  BlockPublicPolicy: true,
  IgnorePublicAcls: true,
  RestrictPublicBuckets: true
});