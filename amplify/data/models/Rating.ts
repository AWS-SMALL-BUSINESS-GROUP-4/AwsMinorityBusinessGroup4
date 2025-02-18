import { a } from '@aws-amplify/backend';

export const Rating = a.model({
  ratingId: a.string(),  //Unique identifier (matches Cognito sub).
  businessId: a.string(),  // Referencing business id from Business model
  userId: a.string(),
  category: a.string(),
  rating: a.integer(),
  ratingDate: a.timestamp()
}).authorization((allow) => [
    allow.owner(),    // Business owner can create, read, update and delete their own Business data
    allow.publicApiKey().to(['read']),  // Allow anyone auth'd with an API key to read everyone's posts.()
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
]);