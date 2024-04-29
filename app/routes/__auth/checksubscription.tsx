import { CheckSub } from '~/utils/checksub.server'
import { redirect, json, type LoaderFunctionArgs } from "@remix-run/node";
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { updateUser } from '~/utils/user.server';
import { GetUser } from '~/utils/loader.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email")
    let user = await GetUser(email)
    // if (!user) { redirect('/login') }

    console.log(user, 'email')
    await CheckSub({ user });
    const subscriptionId = user?.subscriptionId;

    if (subscriptionId) {
        console.log(subscriptionId, 'checking subscription');
        if (user?.returning === true) {
            if (subscriptionId === 'trialing' || subscriptionId === 'active') {
                return redirect('/dealer/quote/Harley-Davidson');
            } else {
                return redirect('/subscribe');
            }
        } else if (user?.returning === false) {
            console.log(subscriptionId, 'checking new subscription');
            if (subscriptionId === 'trialing' || subscriptionId === 'active') {
                await updateUser({ email: user.email, returning: true });
                return redirect('/dealer/welcome/dealerfees');
            } else {
                return redirect('/subscribe');
            }
        }
    } else {
        return redirect('/subscribe');
    }
};


/**export default async function ActivixCall(endpoint, method, data) {
    console.log('activix api call')
    const baseURL = 'http://localhost:3000/v2';
    const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk';
    const headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    if (method === 'GET') {
        try {
            const response = await fetch((baseURL + endpoint), {
                method: method,
                headers: headers,
            });
            const result = await response.json();
            console.log("Success:", result);
            return result
        } catch (error) {
            console.error("Error:", error);
            return error
        }
    }
    if (method === 'POST' || method === 'PUT') {
        try {
            const response = await fetch((baseURL + endpoint), {
                method: method,
                headers: headers,
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log("Success:", result);
            return result
        } catch (error) {
            console.error("Error:", error);
            return error
        }
    }
}
 */
