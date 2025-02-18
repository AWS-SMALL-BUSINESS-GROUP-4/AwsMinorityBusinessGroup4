import { a } from '@aws-amplify/backend';

export const User = a.model({
  userId: a.string(),  //Unique identifier (matches Cognito sub).
  name: a.string(),  
  email: a.string(),  // User’s email (optional, stored only if needed).
  profilePic: a.url(),  // URL of the profile picture.
  joinedAt: a.timestamp(),
  lastLogin: a.timestamp()
}).authorization((allow) => [
    allow.owner(),    // Business owner can create, read, update and delete their own Business data
    allow.publicApiKey().to(['read']), // Allow anyone auth'd with an API key to read everyone's posts.()
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
]);