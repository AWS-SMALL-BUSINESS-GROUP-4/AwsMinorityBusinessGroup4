import { a } from '@aws-amplify/backend';

export const Business = a.model({
  businessId: a.string(),  //Unique identifier (matches Cognito sub).
  ownerId: a.string(),
  name: a.string(),
  description: a.string(),
  city: a.string(),
  latitude: a.float(),
  longitude: a.float(),
  address: a.string(),
  category: a.string(),
  averageRating: a.float()  
}).authorization((allow) => [
    allow.owner(),    // Business owner can create, read, update and delete their own Business data
    allow.publicApiKey().to(['read']),  // Allow anyone auth'd with an API key to read everyone's posts.()
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
]);