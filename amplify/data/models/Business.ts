import { a } from '@aws-amplify/backend';

export const Business = a.model({
  businessId: a.string(),  //Unique identifier (matches Cognito sub).
  ownerId: a.string(),
  name: a.string(),
  description: a.string(),
  city: a.string(),
  latitude: a.float(),
  longitude: a.float(),
  address: a.string(),
  category: a.string(),
  averageRating: a.float()  
}).authorization((allow) => [
    allow.owner(),    // Business owner can create, read, update and delete their own Business data
    // allow.publicApiKey().to(['read']),  // Allow anyone auth'd with an API key to read everyone's posts.()
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
]);

/*
export const Business = a.model({
    businessId: a.string(),  // Unique identifier (matches Cognito sub)
    ownerId: a.string(),
    name: a.string(),
    email: a.string(),  // Business email
    phoneNumber: a.string(),  // Business phone number
    website: a.string().optional(),  // Business website (optional)
    category: a.string(),
    address: a.string(),  // Full formatted address
    street: a.string(),
    aptSuiteOther: a.string(),  // Optional apartment/suite field
    city: a.string(),
    state: a.string(),
    zipcode: a.string(),
    country: a.string(),
    latitude: a.float(),
    longitude: a.float(),
    businessHours: a.mapOf(
      a.object({
        opensAt: a.string().optional(),
        closesAt: a.string().optional(),
        open24Hours: a.boolean().default(false),
        closed: a.boolean().default(false),
      })
    ), // Business hours for Monday-Sunday
    description: a.string(),
    photos: a.listOf(a.string()).optional(), // Store URLs of uploaded photos
    averageRating: a.float()
  }).authorization((allow) => [
      allow.owner(),    // Business owner can create, read, update and delete their own Business data
      allow.publicApiKey().to(['read']),  // Allow anyone auth'd with an API key to read business listings
      allow.groups(['Admin']).to(['read', 'update', 'delete'])
  ]);
  */