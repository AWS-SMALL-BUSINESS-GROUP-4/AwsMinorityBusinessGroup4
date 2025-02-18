import { a } from '@aws-amplify/backend';

export const Review = a.model({
  reviewId: a.string(),  //Unique identifier (matches Cognito sub).
  businessId: a.string(),
  userId: a.string(),
  rating: a.float(),
  content: a.string(),
  reviewDate: a.timestamp()
}).authorization((allow) => [
    allow.owner(),    // Business owner can create, read, update and delete their own Business data
    allow.publicApiKey().to(['read']),  // Allow anyone auth'd with an API key to read everyone's posts.()
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
]);