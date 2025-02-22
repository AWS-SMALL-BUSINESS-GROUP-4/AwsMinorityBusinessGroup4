import { a } from '@aws-amplify/backend';

export const Review = a.model({ 
  businessId: a.id(),  // reference field to match Business identifier
  business: a.belongsTo('Business', 'businessId'),
  userId: a.id(),  // reference field to match User identifier
  user: a.belongsTo('User', 'userId'),
  rating: a.float().required(),
  content: a.string().required(),
  reviewDate: a.timestamp()
}).authorization((allow) => [
    allow.owner(), 
    allow.guest().to(['read']),
    allow.groups(['Admin']).to(['read', 'update', 'delete'])
]).secondaryIndexes((index) => [index("businessId"), index("userId")]);