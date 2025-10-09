import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

const backend = defineBackend({
  auth,
  data,
  storage
});

// HIPAA: Enable encryption and versioning for S3
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

// Block public access
s3Bucket.addPropertyOverride('PublicAccessBlockConfiguration', {
  BlockPublicAcls: true,
  BlockPublicPolicy: true,
  IgnorePublicAcls: true,
  RestrictPublicBuckets: true
});