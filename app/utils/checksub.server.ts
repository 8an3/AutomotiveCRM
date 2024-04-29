import stripe from 'stripe';
import { updateUser } from '~/utils/user.server'
import { redirect } from "@remix-run/node";

export async function CheckSub({ user }) {
    const email = user.email
    const apikey = process.env.STRIPE_SECRET_KEY;
    const customer = await stripe(apikey).customers.list({ email: email, limit: 1 });
    console.log('customer', customer)
    if (customer && customer.data && customer.data[0] && customer.data[0].id) {
        const customerId = customer.data[0].id;
        console.log('1')
        const subscriptions = await stripe(apikey).subscriptions.list({ status: "trialing" || "active", customer: customerId });
        console.log('subscriptions', subscriptions)
        if (subscriptions && subscriptions.data && subscriptions.data[0] && subscriptions.data[0].status) {
            const subscriptionId = subscriptions.data[0].status;
            console.log('2')
            if (subscriptionId === "trialing") {
                console.log('3', email)
                console.log("subscriptionId", subscriptionId)
                const update = await updateUser({ email: email, subscriptionId: subscriptionId, customerId: customerId })
                return update
            }
            else if (subscriptionId === "active") {
                //console.log("subscriptionId", subscriptionId)
                console.log('4')
                const update = await updateUser({ email: email, subscriptionId: subscriptionId, customerId: customerId })
                return update
            }
        }
    } else {
        return redirect('/subscribe')
    }

}



/*Store the last subscription check timestamp in your user database along with other user information.

When you run your CheckSub function, first retrieve the user data, including the last subscription check timestamp.

Compare the last subscription check timestamp with the current time. If it's more than 30 days ago, proceed with checking the subscription as you are currently doing. Otherwise, skip the subscription check.

Here's a modified version of your CheckSub function:

javascript
Copy code
export async function CheckSub({ user }) {
    const email = user.email;
    const lastSubscriptionCheck = user.lastSubscriptionCheck; // Retrieve the last check timestamp from the user data
    const currentTime = new Date().getTime();
    const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    if (!lastSubscriptionCheck || currentTime - lastSubscriptionCheck >= thirtyDaysInMillis) {
        const apikey = process.env.STRIPE_SECRET_KEY;
        const customer = await stripe(apikey).customers.list({ email: email, limit: 1 });

        if (customer && customer.data && customer.data[0] && customer.data[0].id) {
            const customerId = customer.data[0].id;
            const subscriptions = await stripe(apikey).subscriptions.list({ status: "trialing" || "active", customer: customerId });

            if (subscriptions && subscriptions.data && subscriptions.data[0] && subscriptions.data[0].status) {
                const subscriptionId = subscriptions.data[0].status;

                if (subscriptionId === "trialing" || subscriptionId === "active") {
                    await updateUser({ email: email, subscriptionId: subscriptionId, customerId: customerId });

                    // Update the last subscription check timestamp in the user data
                    await updateUser({ email: email, lastSubscriptionCheck: currentTime });

                    return redirect('/checksubscription');
                }
            }
        } else {
            return redirect('/subscribe');
        }
    }

    // No need to check the subscription again if last checked within 30 days
    return redirect('/dashboard'); // Redirect to the dashboard or any other appropriate page
}*/
