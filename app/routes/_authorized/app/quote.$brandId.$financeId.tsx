import { Form, useLoaderData, useParams, } from '@remix-run/react'
import { Input, Label, Button, Separator } from '~/components/ui/index'
import { quoteAction, quoteLoader } from '~/components/actions/quoteAction'
import { type MetaFunction } from '@remix-run/node'
import { ImageSelect } from '~/routes/overviewUtils/imageselect'
import { ListSelection } from '~/routes/quoteUtils/listSelection'
import { useRootLoaderData } from "~/hooks";
import { last } from 'voca'
import { useState } from 'react'

export const meta: MetaFunction = () => {
    return [
        { title: "Quote - Dealer Sales Assistant" },
        {
            property: "og:title",
            content: "Your very own assistant!",
        },
        {
            name: "description",
            content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
            keywords: 'Automotive Sales, dealership sales, automotive CRM',
        },
    ];
};

export default function Quote() {
    return (
        <>
            <Quote />
        </>
    )
}
