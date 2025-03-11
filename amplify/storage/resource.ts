import { defineStorage } from '@aws-amplify/backend';

export const firstBucket = defineStorage({
    name: 'AWSMBG4-public',
    isDefault: true, 
    access: (allow) => ({
        
    })
  });
  
  export const secondBucket = defineStorage({
    name: 'AWSMBG4-private',
    access: (allow) => ({
      'businesses/{business_id}/*': [
        allow.entity('identity').to(['read', 'write', 'delete'])
      ],
      'businesses/{business_id}/photos/{photo_id}': [
        allow.guest.to(['read'])
      ],
      'users/{user_id}/*': [
        allow.entity('identity').to(['read', 'write', 'delete'])
      ],
      'users/{user_id}/photos/{photo_id}': [
        allow.guest.to(['read'])
      ],
    })
  })