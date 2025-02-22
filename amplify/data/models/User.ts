import { a } from '@aws-amplify/backend';

export const User = a.model({
  userId: a.id().required(),
  name: a.string(),  
  email: a.string(), 
  profilePic: a.url(),
  joinedAt: a.timestamp().required(),
  lastLogin: a.timestamp().required(),
  reviews: a.hasMany('Review', 'businessId')
}).authorization((allow) => [
    allow.owner(), 
    allow.guest().to(['read']),
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
]);