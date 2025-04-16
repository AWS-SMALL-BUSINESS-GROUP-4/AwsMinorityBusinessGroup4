import { signInWithRedirect, signOut } from 'aws-amplify/auth';

export async function Login(uri) {
    console.log("Uri is: ", uri, uri == null);
    const fromPath = (typeof uri === 'string')? uri : window.location.pathname;
    // You can choose: localStorage OR URL query param
    localStorage.setItem('postLoginRedirect', fromPath);
    const response = await signInWithRedirect({
        provider: 'Google',
    });
}

export async function Logout(uri) {
    const fromPath = (typeof uri === 'string')? uri : window.location.pathname;
    // You can choose: localStorage OR URL query param
    localStorage.setItem('postLoginRedirect', uri || fromPath);
    const response = await signOut({
        global: false,
    });
}