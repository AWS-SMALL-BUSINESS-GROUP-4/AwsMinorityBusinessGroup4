import 'aws-amplify/auth/enable-oauth-listener';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RedirectPage() {
    [unsubscribe, setUnsubscribe] = useState(null);
    const navigate = useNavigate();
    useEffect(()=> {
        const temp = Hub.listen("auth", async ({ payload }) => {
          console.log(`Listener ran, payload is ${payload}`);
          switch (payload.event) {
            case "signInWithRedirect":
              const user = await getCurrentUser();
              const userAttributes = await fetchUserAttributes();
              console.log({user, userAttributes});
              break;
            case "signInWithRedirect_failure":
              // handle sign in failure
              break;
            case "customOAuthState":
              const state = payload.data; // this will be customState provided on signInWithRedirect function
              console.log(state);
              navigate(payload.data);
              break;
          }
        });
        setUnsubscribe(temp);
    }, []);

    return (
        <p>Redirecting...</p>
    );

}

