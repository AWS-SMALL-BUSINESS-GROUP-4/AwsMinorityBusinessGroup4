import { a } from '@aws-amplify/backend';

export const Review = a.model({
  reviewId: a.id().required(),  //Unique identifier (matches Cognito sub).
  businessId: a.id().required(),
  business: a.belongsTo('Business', 'businessId'),
  userId: a.string().required(),
  user: a.belongsTo('User', 'userId'),
  rating: a.float().required(),
  content: a.string().required(),
  reviewDate: a.timestamp()
}).authorization((allow) => [
    allow.owner(), 
    allow.guest().to(['read']),  // Allow anyone auth'd with an API key to read everyone's posts.()
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
]).secondaryIndexes((index) => [index("businessId"), index("userId")]);