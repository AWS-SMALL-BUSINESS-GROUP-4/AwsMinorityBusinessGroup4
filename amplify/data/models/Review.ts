import { a } from '@aws-amplify/backend';

export const Review = a.model({
  reviewId: a.string(),  //Unique identifier (matches Cognito sub).
  businessID: a.string(),
  userID: a.string(),
  rating: a.float(),
  content: a.string(),
  reviewDate: a.timestamp()
}).authorization((allow) => [allow.owner()]);