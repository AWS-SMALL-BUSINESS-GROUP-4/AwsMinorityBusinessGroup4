import { a } from '@aws-amplify/backend';

export const Business = a.model({
  businessId: a.id().required(), 
  ownerId: a.id().required(), 
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
  businessHours: a.json(), 
  description: a.string().required(),
  photos: a.url().array(),
  averageRating: a.float(),
  reviews: a.hasMany('Review', 'businessId')
}).authorization((allow) => [
    allow.owner(), 
    allow.guest().to(['read']), 
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
]).secondaryIndexes((index) => [index("ownerId")]);

