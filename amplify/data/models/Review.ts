import { a } from '@aws-amplify/backend';

export const Review = a.model({
  reviewId: a.string(),  //Unique identifier (matches Cognito sub).
  businessId: a.string(),
  userId: a.string(),
  rating: a.float(),
  content: a.string(),
  reviewDate: a.timestamp()
}).authorization((allow) => [allow.owner()]);