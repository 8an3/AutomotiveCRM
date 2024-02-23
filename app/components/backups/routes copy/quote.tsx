import { Links, Meta, Outlet, useLoaderData } from '@remix-run/react'
import { type MetaFunction, redirect, type LoaderFunctionArgs, json } from '@remix-run/node'
import { requireUserSession } from "~/helpers";

import { model } from '~/models'
import WidthSlider from '~/components/shared/slider'
//import { getSession } from '~/utils/pref.server'
import { Theme, ThemePanel } from '@radix-ui/themes';
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import Sidebar from "~/components/shared/sidebar";
import { requireAuthCookie } from '~/utils/misc.user.server';


export async function loader({ request, params }: LoaderFunctionArgs) {
    const userSession = await authenticator.isAuthenticated(request, { failureRedirect: "/login", });
    console.log(userSession, 'userSession')
    const user = await model.user.query.getForSession({ id: userSession.id });

    if (user?.subscriptionId === 'active' || user?.subscriptionId === 'trialing') {
        const session = await getSession(request.headers.get("Cookie"))
        const sliderWidth = session.get('sliderWidth')
        return json({ sliderWidth })
    }
    return redirect('/subscribe');
}


export const meta: MetaFunction = () => {
    return [
        { title: "Quote - Dealer Sales Assistant" },
        {
            property: "og:title",
            content: "Your very own assistant!",
        },
        {
            name: "description",
            content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.", keywords: 'Automotive Sales, dealership sales, automotive CRM',
        },
    ];
};


export default function Quote() {
    const { sliderWidth } = useLoaderData()


    return (
        <>
            <Sidebar />
            <div className="flex min-h-screen px-4 sm:px-6 lg:px-8 bg-slate1">
                <div className="w-full overflow-hidden rounded-lg ">
                    <div className="md:flex my-auto mx-auto">
                        <div
                            className="my-auto mx-auto"
                            style={{ width: sliderWidth }}
                        >
                            <div className="my-auto mx-auto">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
