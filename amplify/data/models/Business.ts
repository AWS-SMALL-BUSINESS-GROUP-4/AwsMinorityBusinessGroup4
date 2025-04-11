import { a } from '@aws-amplify/backend';

export const Business = a.model({
  businessOwnerId: a.id(),   //reference field to match User identfier
  businessOwner: a.belongsTo('User', 'businessOwnerId'), 
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
  businessHours: a.hasMany('BusinessHours', 'businessId'),
  description: a.string().required(),
  photos: a.url().array(),
  averageRating: a.float(),
  reviews: a.hasMany('Review', 'businessId')
}).authorization((allow) => [
    allow.owner(), 
    allow.guest().to(['read']), 
    allow.authenticated().to(['read']),
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
])

export const BusinessHours = a.model({
  businessId: a.id(),
  business: a.belongsTo('Business', 'businessId'),
  day: a.string().required(),
  openTime: a.string(),
  closeTime: a.string(),
  isOpen24: a.boolean().required(),
  isClosed: a.boolean().required()
}).authorization((allow) => [
    allow.owner(), 
    allow.guest().to(['read']), 
    allow.authenticated().to(['read']),
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
]);