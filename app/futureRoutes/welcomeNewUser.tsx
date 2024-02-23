import { CheckSub } from '~/utils/checksub.server'
import { redirect, json } from "@remix-run/node";
import { prisma } from "~/libs";
import { getSession } from "~/sessions/auth-session.server";


export const loader = async ({ request }) => {
    const userSession = await authenticator.isAuthenticated(request, { failureRedirect: "/login", });
    const user = await model.user.query.getForSession({ id: userSession.id });
    if (!user) { return json({ status: 302, redirect: 'login' }); };

    if (user.subscriptionId === 'trialing') {
        return redirect('/welcome/dealerfees')
    }
    if (user.subscriptionId === 'active') {
        return redirect('/welcome/dealerfees')
    }
    return redirect('/subscribe')
}

