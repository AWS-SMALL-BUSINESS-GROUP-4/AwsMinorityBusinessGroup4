import { a } from '@aws-amplify/backend';

export const User = a.model({
  name: a.customType({
    firstName: a.string().required(),
    lastName: a.string().required()
  }),  
  email: a.email().required(), 
  profilePic: a.url(),
  joinedAt: a.timestamp(),
  lastLogin: a.timestamp(),
  reviews: a.hasMany('Review', 'userId'),
  businesses: a.hasMany('Business', 'businessOwnerId')
}).authorization((allow) => [
    allow.owner(), 
    allow.guest().to(['read']),
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
]);