import { a } from '@aws-amplify/backend';

export const Rating = a.model({
  ratingId: a.id(),  //Unique identifier (matches Cognito sub).
  businessId: a.string(),  // Referencing business id from Business model
  userId: a.id(),
  category: a.string(),
  rating: a.integer(),
  ratingDate: a.timestamp()
}).authorization((allow) => [allow.owner()]);