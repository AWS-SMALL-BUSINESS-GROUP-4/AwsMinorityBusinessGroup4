import { defineStorage } from '@aws-amplify/backend';
  
  export const storage = defineStorage({
    name: 'AWSMBG4-private',
    access: (allow) => ({
      'business-photos/*': [
        //allow.entity('identity').to(['read', 'write', 'delete']),
        allow.authenticated.to(['read', 'write', 'delete']), // Update once auth is fully figured out
        allow.guest.to(['read']),
      ],
      'review-photos/*': [
        //allow.entity('identity').to(['read', 'write', 'delete']),
        allow.authenticated.to(['read', 'write', 'delete']), // Update once auth is fully figured out
        allow.guest.to(['read']),
      ],
    })
  })