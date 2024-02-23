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
import NotificationSystem from "./notifications";
import slider from '~/styles/slider.css'

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: slider },
];

export async function loader({ request, params }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email")

    const user = await model.user.query.getForSession({ email: email });

    const notifications = await prisma.notificationsUser.findMany({
        where: {
            userId: user.id,
        }
    })
    if (user?.subscriptionId === 'active' || user?.subscriptionId === 'trialing') {
        const session = await getSession(request.headers.get("Cookie"))
        const sliderWidth = session.get('sliderWidth')
        return json({ sliderWidth, notifications })
    }

    return json({ notifications }, redirect('/subscribe'))
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
    const { notifications } = useLoaderData()


    return (
        <>
            <Sidebar />
            <NotificationSystem notifications={notifications} />

            <div className="flex h-[100vh] px-4 sm:px-6 lg:px-8 bg-slate1">
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
