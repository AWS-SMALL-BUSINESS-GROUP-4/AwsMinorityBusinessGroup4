import { a, defineData } from '@aws-amplify/backend';
import { Business, BusinessHours } from './models/Business';
import { Review } from './models/Review';
import { User } from './models/User';

const schema = a.schema({ Business, BusinessHours, Review, User });

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});