import { a } from '@aws-amplify/backend';

export const Business = a.model({
  id: a.string(),  //Unique identifier (matches Cognito sub).
  ownerId: a.string(),
  name: a.string(),
  description: a.string(),
  city: a.string(),
  latitude: a.float(),
  longitude: a.float(),
  address: a.string(),
  category: a.string(),
  averageRating: a.float()  
}).authorization((allow) => [allow.owner()]);