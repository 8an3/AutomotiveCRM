import React from 'react';
import { Button } from "~/components/ui/button"
import { LinksFunction, type MetaFunction, DataFunctionArgs, V2_MetaFunction } from '@remix-run/node'
import {
    Form, Link, Links, LiveReload, useNavigation, Outlet, Scripts, ScrollRestoration, useFetcher, useFetchers, useLoaderData, useMatches, useSubmit,
} from '@remix-run/react'
import { ButtonLoading } from "~/components/ui/button-loading";
import { toast } from "sonner"

export const meta: MetaFunction = ({ data }) => {
    return [
        { title: "Subscribe - Dealer Sales Assistant" },
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


export default function Subscribe() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (
        <>
            <div className="flex min-h-screen px-4 py-12 sm:px-6 lg:px-8 centered-center bg-black">
                <div className="w-full  h-full overflow-hidden ">
                    <div className="md:flex">
                        <div className="p-4 mx-auto my-auto">
                            <div className='grid grid-cols-1 place-content-center mx-auto my-auto	mt-6' >
                                <div className="item-4 grid grid-cols-1 scriptcard justify-end mx-auto my-auto	h-[450px] ">
                                    <div className="text-center">
                                        <h2 className="scriptcardText text-[#fafafa] text-3xl sm:mt-0 mt-6 font-thin tracking-tight  sm:text-4xl mb-6 ">
                                            Subscription Plan
                                        </h2>
                                        <p className="scriptcardText text-[#fff]">
                                            Cancel at any time with no penalty, plan includes full access to all the features we provide.
                                        </p>
                                        <h3 className="scriptcardTitler text-[#fff]">
                                            $19.95/MONTH
                                        </h3>
                                        <a href='https://buy.stripe.com/14k6pTg9J0IV0G4fYZ' target="_blank">
                                            <Button type="submit" name='_action' value='subscribe' className=" border border-slate1  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border text-[#fff]" >

                                                Subscribe
                                            </Button>
                                        </a>
                                        <p className="scriptcardText text-sm mt-6 text-[#fff]">
                                            Once subscribed you can continue to the walkthrough.
                                        </p>
                                        <Link to='/checksubscription' >

                                            <ButtonLoading
                                                onClick={() => toast.success(`Thank-you for your business!`)}

                                                size="lg"
                                                name='intent'
                                                value='returnToQuote'
                                                type='submit'
                                                isSubmitting={isSubmitting}
                                                loadingText="Checking Subscription..."
                                                className="w-auto cursor-pointer ml-auto mt-5  text-[#fff] border-[#fff]hover:text-[#02a9ff]"
                                            >                                                Continue
                                            </ButtonLoading>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
