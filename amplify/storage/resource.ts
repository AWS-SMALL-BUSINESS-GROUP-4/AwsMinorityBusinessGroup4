import { defineStorage } from '@aws-amplify/backend';
  
  export const storage = defineStorage({
    name: 'AWSMBG4-private',
    access: (allow) => ({
      'business-photos/*': [
        //allow.entity('identity').to(['read', 'write', 'delete']),
        allow.guest.to(['read', 'write', 'delete']), // Update once auth is fully figured out
      ],
      'review-photos/*': [
        //allow.entity('identity').to(['read', 'write', 'delete']),
        allow.guest.to(['read', 'write', 'delete']), // Update once auth is fully figured out
      ],
    })
  })