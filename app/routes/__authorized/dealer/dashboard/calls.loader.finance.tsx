
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
            userEmail: {
                equals: user.email,
            },
        },
    });
    const clientfile = await prisma.clientfile.findMany({
        where: {
            email: {
                in: financeData.map(financeRecord => financeRecord.email),
            },
        },
    });
    const combinedData = financeData.map(financeRecord => {
        const correspondingDashRecord = clientfile.find(file => file.email === financeRecord.email);

        return {
            ...correspondingDashRecord,
            ...financeRecord,

        };
    });

    // console.log('financeData:', combinedData);
    return combinedData
}
