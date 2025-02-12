import { a } from '@aws-amplify/backend';

export const User = a.model({
  userId: a.string(),  //Unique identifier (matches Cognito sub).
  name: a.string(),  
  email: a.string(),  // User’s email (optional, stored only if needed).
  profilePic: a.url(),  // URL of the profile picture.
  joinedAt: a.timestamp(),
  lastLogin: a.timestamp()
}).authorization((allow) => [allow.owner()]);