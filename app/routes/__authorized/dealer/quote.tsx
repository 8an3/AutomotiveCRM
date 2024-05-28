import { Links, Meta, Outlet, useLoaderData } from "@remix-run/react";
import {
    type MetaFunction,
    redirect,
    type LoaderFunctionArgs,
    json,
    type LinksFunction,
} from "@remix-run/node";
import { prisma } from "~/libs";
import { getSession } from "~/sessions/auth-session.server";
import slider from "~/styles/slider.css";
import { GetUser } from "~/utils/loader.server";
import { useState } from "react";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: slider }];

export async function loader({ request, params }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email");
    let newLook = false
    let user = await GetUser(email);
    let sliderWidth = session.get("sliderWidth");
    if (!sliderWidth) {
        sliderWidth = "50";
    }
    const brandId = params.brandId
    switch (user?.newLook) {
        case 'on':
            newLook = true
            break;
        default:
            null
    }
    return json({ email, user, sliderWidth, newLook });
}

export default function Quote() {
    const { newLook } = useLoaderData()
    return (
        <>
            <div className={`flex h-[100vh]  px-4 sm:px-6 lg:px-8 ${newLook === true ? 'bg-[#09090b] text-[#fafafa]' : 'bg-slate1 text-black'}`}>
                <div className="w-full overflow-hidden rounded-lg ">
                    <div className="mx-auto my-auto md:flex">
                        <div className="mx-auto my-auto" >
                            <div className="mx-auto my-auto" >
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
export const meta = () => {
    return [
        { title: "Quote - Dealer Sales Assistant" },
        {
            property: "og:title",
            content: "Your very own assistant!",
        },
        {
            name: "description",
            content:
                "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
            keywords: "Automotive Sales, dealership sales, automotive CRM",
        },
    ];
};
