import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { Business } from './models/Business';
import { Review } from './models/Review';
import { User } from './models/User';

const schema = a.schema({ Business, Review, User });

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});