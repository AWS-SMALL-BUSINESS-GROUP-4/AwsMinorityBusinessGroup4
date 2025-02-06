import { a } from '@aws-amplify/backend';

export const Business = a.model({
  id: a.string(),  //Unique identifier (matches Cognito sub).
  name: a.string(),  
  email: a.string(),  // User’s email (optional, stored only if needed).
  profilePic: a.string()  // URL of the profile picture.
}).authorization((allow) => [allow.owner()]);
