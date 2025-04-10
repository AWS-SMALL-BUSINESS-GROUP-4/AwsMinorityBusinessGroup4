
import { signInWithRedirect, signOut } from 'aws-amplify/auth';

export async function signIn(customState) {
    const response = await signInWithRedirect({
        provider: 'Google',
        customState: customState
    });
    console.log("Result of signIn: ", response);
}

export async function signOut(customState) {
    const response = await signOut({
        global: false,
        oauth: {
            redirect: customState
        }
    });
    console.log("Result of signOut: ", response);
}