import { a } from '@aws-amplify/backend';

export const Review = a.model({
  reviewId: a.id(),  //Unique identifier (matches Cognito sub).
  businessID: a.id(),
  userID: a.id(),
  rating: a.float(),
  content: a.string(),
  reviewDate: a.timestamp()
}).authorization((allow) => [allow.owner()]);