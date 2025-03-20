import { defineStorage } from '@aws-amplify/backend';

// Public bucket for publicly accessible files
export const publicBucket = defineStorage({
  name: 'awsmbg4-public', 
  isDefault: true,
  access: (allow) => ({
    'public/*': [
      allow.guest.to(['read'])
    ]
  })
});

// Private bucket for business and user-specific files
export const privateBucket = defineStorage({
  name: 'awsmbg4-private',
  access: (allow) => ({
    'businesses/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],
   
    'users/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],

  })
});