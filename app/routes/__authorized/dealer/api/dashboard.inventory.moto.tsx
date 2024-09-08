
import { type DataFunctionArgs, type V2_MetaFunction, type ActionFunction, type LoaderFunction, json, type LoaderFunction } from '@remix-run/node'
import { getMergedFinance } from "~/utils/dashloader/dashloader.server";
import { prisma } from '~/libs';
import { getSession } from "~/sessions/auth-session.server";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'
import { commitSession } from '~/sessions/session.server';

export async function loader({ request, params }: LoaderFunction) {
    const inventoryMotorcycle = await prisma.inventoryMotorcycle.findMany()

    // console.log(dataSet, 'dataSet', userEmail)
    return inventoryMotorcycle
}
/**
 * , {
        headers: {
            "Set-Cookie":

                await cookie.serialize({
                    'name': name,
                    email: email,
                    refreshToken: tokens.refresh_token,
                    accessToken: tokens.access_token,
                }),

        },
    });
let cookie = createCookie("session_66", {
    secrets: ['secret'],
    // 30 days
    maxAge: 30 * 30 * 24 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });


 */

