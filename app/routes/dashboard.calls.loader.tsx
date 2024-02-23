
import { defer, type V2_MetaFunction, type ActionFunction, type LoaderFunction, json, type LoaderFunction } from '@remix-run/node'
import { getMergedFinance } from "~/utils/dashloader/dashloader.server";
import { prisma } from '~/libs';
import { getSession } from "~/sessions/auth-session.server";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'
import { commitSession } from '~/sessions/session.server';

export async function loader({ request, params }: LoaderFunction) {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email")
    const user = await model.user.query.getForSession({ email: email });
    if (!user) { redirect('/login') }
    const dataSet = await getMergedFinance(email);
    // console.log(dataSet, 'dataSet loader')
    return json(dataSet)
}

