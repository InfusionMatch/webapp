import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'northpeakStorage',
  access: (allow) => ({
    // Nurse credentials and documents
    'nurse-credentials/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    // Visit documentation
    'visit-documents/{entity_id}/*': [
      allow.authenticated.to(['read', 'write'])
    ],
    // Admin-only access
    'admin-reports/*': [
      allow.authenticated.to(['read'])
    ],
    // Platform documents (contracts, policies, etc.)
    'platform-documents/*': [
      allow.authenticated.to(['read'])
    ]
  })
});