import { Amplify } from 'aws-amplify';
import amplifyOutputs from './amplify_outputs.json'; // Adjust path if needed

Amplify.configure(amplifyOutputs);

export default Amplify;