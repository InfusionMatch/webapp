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
  fieldLogLevel: 'ALL',
  excludeVerboseContent: false
};
