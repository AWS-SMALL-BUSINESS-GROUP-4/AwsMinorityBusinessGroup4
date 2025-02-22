import { a } from '@aws-amplify/backend';

export const Business = a.model({
  businessId: a.id().required(),  //Unique identifier (matches Cognito sub).
  ownerId: a.id().required(),  // Foreign key to User
  name: a.string().required(),
  email: a.email().required(),
  phoneNumber: a.phone().required(), 
  website: a.url(),  
  category: a.string().required(),
  streetAddress: a.string().required(),
  aptSuiteOther: a.string(), 
  city: a.string().required(),
  state: a.string().required(),
  zipcode: a.string().required(),
  country: a.string().required(),
  location: a.customType({
    lattitude: a.float(),
    longitude: a.float()
}),
  businessHours: a.json(),  // Store structured business hours
  description: a.string().required(),
  photos: a.url().array(), // Store URLs of uploaded photos
  averageRating: a.float(),
  reviews: a.hasMany('Review', 'businessId')
}).authorization((allow) => [
    allow.owner(),    // Business owner can create, read, update and delete their own Business data
    allow.guest().to(['read']),  // Allow anyone auth'd with an API key to read everyone's posts.()
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
]).secondaryIndexes((index) => [index("ownerId")]);

