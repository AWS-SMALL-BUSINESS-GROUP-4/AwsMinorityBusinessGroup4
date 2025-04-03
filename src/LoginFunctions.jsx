import { signInWithRedirect, signOut } from "@aws-amplify/auth";

export async function handleLogin() {
    const response = await signInWithRedirect({
        provider: "Google",
        customState: "write-reivew",
    });
    console.log("Logged in successfully!, ", response);
}

export async function handleLogout() {
    const response = await signOut();
    console.log("Signed out successfully!", response);
}