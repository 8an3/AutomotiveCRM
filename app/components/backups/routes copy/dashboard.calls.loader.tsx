
import { type DataFunctionArgs, type V2_MetaFunction, type ActionFunction, type LoaderFunction, json, type LoaderFunction } from '@remix-run/node'
import { getMergedFinance } from "~/utils/dashloader/dashloader.server";
import { prisma } from '~/libs';
import { getSession } from "~/sessions/auth-session.server";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'

export async function loader({ request, params }: LoaderFunction) {
    const userSession = await authenticator.isAuthenticated(request, { failureRedirect: "/login", });
    const user = await model.user.query.getForSession({ id: userSession.id });

    if (!user) { return json({ status: 302, redirect: 'login' }); };

    console.log(user, 'email')
    const userEmail = user?.email
    const dataSet = await getMergedFinance(userEmail);
    return json(dataSet)
}


