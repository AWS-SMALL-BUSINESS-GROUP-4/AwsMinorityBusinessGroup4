import { defineStorage } from '@aws-amplify/backend';

// Public bucket for publicly accessible files
export const publicBucket = defineStorage({
  name: 'awsmbg4-public', // Ensure lowercase and no special characters
  isDefault: true,
  access: (allow) => ({
    // Allow public read access to all files in the bucket
    'public/*': [
      allow.guest.to(['read'])
    ]
  })
});

// Private bucket for business and user-specific files
export const privateBucket = defineStorage({
  name: 'awsmbg4-private', // Ensure lowercase and no special characters
  access: (allow) => ({
    // Allow business owners to manage their files
    'businesses/{business_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    // Allow guests to read business photos
    'businesses/{business_id}/photos/*': [
      allow.guest.to(['read'])
    ],
    // Allow users to manage their files
    'users/{user_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    // Allow guests to read user profile photos
    'users/{user_id}/photos/*': [
      allow.guest.to(['read'])
    ]
  })
});