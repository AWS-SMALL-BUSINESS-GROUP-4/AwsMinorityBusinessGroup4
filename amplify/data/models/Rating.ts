import { a } from '@aws-amplify/backend';

export const Rating = a.model({
  ratingID: a.string(),  //Unique identifier (matches Cognito sub).
  businessID: a.string(),  // Referencing business id from Business model
  userID: a.string(),
  category: a.string(),
  rating: a.integer(),
  ratingDate: a.timestamp()
}).authorization((allow) => [allow.owner()]);