
import { defer, type V2_MetaFunction, type ActionFunction, type LoaderFunction, json, type LoaderFunction, redirect } from '@remix-run/node'
import { prisma } from '~/libs';
import { getSession } from "~/sessions/auth-session.server";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'
import { commitSession } from '~/sessions/session.server';
import { GetUser } from "~/utils/loader.server";
import { getClientListMerged, getMergedFinanceOnFinance, getMergedFinance } from "~/utils/dashloader/dashloader.server";

export async function loader({ request, params }: LoaderFunction) {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email")
    const user = await GetUser(email)
    if (!user) { redirect('/login') }
    //const dataSet = await getMergedFinance(email);

    const financeList = await prisma.finance.findMany({ where: { userEmail: user?.email }, });
    const financeIds = financeList.map(financeRecord => financeRecord.id);
    const dataSet = await getClientListMerged(financeIds);
    console.log(dataSet, financeList, financeIds, 'dataSet loader')
    return json(dataSet)
}

