import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@aws-amplify/auth";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() =>{
        const completeSignIn = async () => {
            try {   
                await getCurrentUser();
                const redirectPath = localStorage.getItem('postLoginRedirect') || '/';
                //localStorage.removeItem('postLoginRedirect');
                navigate(redirectPath);
            } catch(error) {
                console.error('Authentication error:', error);
                navigate('/');
            }
        };

        completeSignIn();
    }, [navigate]);

    return <p>Redirecting...</p>
}