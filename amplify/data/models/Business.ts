import { a } from '@aws-amplify/backend';

export const Business = a.model({
  businessID: a.string(),  //Unique identifier (matches Cognito sub).
  ownerID: a.string(),
  name: a.string(),
  description: a.string(),
  city: a.string(),
  latitude: a.float(),
  longitude: a.float(),
  address: a.string(),
  category: a.string(),
  averageRating: a.float()  
}).authorization((allow) => [allow.owner()]);