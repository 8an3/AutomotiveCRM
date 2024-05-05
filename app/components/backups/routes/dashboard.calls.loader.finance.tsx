
import { type DataFunctionArgs, type V2_MetaFunction, type ActionFunction, type LoaderFunction, json, type LoaderFunction } from '@remix-run/node'
import { getMergedFinance } from "~/utils/dashloader/dashloader.server";
import { prisma } from '~/libs';
import { getSession } from "~/sessions/auth-session.server";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'
import { commitSession } from '~/sessions/session.server';
import { GetUser } from "~/utils/loader.server";

export async function loader({ request, params }: LoaderFunction) {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email")


    const user = await GetUser(email)
    /// console.log(user, account, 'wquiote loadert')
    if (!user) {
        redirect('/login')
    }

    const financeData = await prisma.finance.findMany({
        where: {
            financeManager: {
                equals: user.email,
            },
        },
    });
    const dashData = await prisma.dashboard.findMany({
        where: {
            financeId: {
                in: financeData.map(financeRecord => financeRecord.id),
            },
        },
    });
    const combinedData = financeData.map(financeRecord => {
        const correspondingDashRecord = dashData.find(dashRecord => dashRecord.financeId === financeRecord.id);

        return {
            ...correspondingDashRecord,
            ...financeRecord,

        };
    });

    // console.log('financeData:', combinedData);
    return financeData
}
