import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

// Configure Amplify with your aws-exports settings.
Amplify.configure(awsExports);

// (Optionally) export Amplify if you need it elsewhere.
export default Amplify;
