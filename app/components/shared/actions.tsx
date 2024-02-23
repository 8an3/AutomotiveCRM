import { json, redirect, type ActionFunction, type DataFunctionArgs, type LoaderFunction } from '@remix-run/node'
import { createSalesScript, createSuggestions, updateUser } from '#app/utils/user.server.ts'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { prisma } from "~/libs";
import stripe from 'stripe';
import { requireUserSession } from '~/helpers';
import { getLatestFinances5 } from '~/utils/finance/get.server'
import { getSession } from '~/sessions/auth-session.server';

export async function useUserLoader({ request }: DataFunctionArgs) {
    const { user } = await requireUserSession(request);
    const email = user.email

    const session = await getSession(request.headers.get("Cookie"))
    const sliderWidth = session.get('sliderWidth')
    let financeCookie = session.get('financeId')


    async function findQuoteById(financeCookie) {
        ////console.log('latest fnance', email)
        try {
            const latestFinance = await prisma.finance.findUnique({
                where: {
                    id: financeCookie,
                },
            });
            return latestFinance;
        } catch (error) {
            console.error("Error retrieving latest finance:", error);
            throw new Error("Failed to retrieve latest quote");
        }
    }
    await getLatestFinances5(financeCookie)
    let finance = await findQuoteById(email)
    if (finance === null || finance === undefined) {
        await getLatestFinances5(financeCookie);
    }
    return json({ user, finance, findQuoteById, request })
}

export const rootAction: ActionFunction = async ({ request }) => {
    const { user } = await requireUserSession(request);
    const formPayload = Object.fromEntries(await request.formData())
    const formInput = financeFormSchema.parse(formPayload)
    if (formInput._action === "updateWelcomeDF") {
        return null
    }
}

export const proRootLoader: LoaderFunction = async ({ request }) => {
    const { user } = await requireUserSession(request);
    const apikey = process.env.STRIPE_SECRET_KEY
    const customer = await stripe(apikey).customers.list({ email: user.email, limit: 1, });
    const customerId = customer.data[0].id;
    const subscriptions = await stripe(apikey).subscriptions.list({
        status: "trialing" || "active",
        customer: customerId,
    }); //console.log(subscriptions)
    const subscriptionId = subscriptions.data[0].status
    //console.log(user)
    return json({ user, subscriptionId, customerId, subscriptions, customer })
}

export const financeFormSchema = z.object({
    // user
    id: zfd.text(z.string().optional()),
    fuser: zfd.text(z.string().optional()),
    lname: zfd.text(z.string().optional()),
    phone: zfd.text(z.string().optional()),
    email: z.string().email(),
    userEmail: zfd.text(z.string().optional()),
    subscriptionId: zfd.text(z.string().optional()),
    returning: zfd.text(z.string().optional()),
    _action: zfd.text(z.string().optional()),
    //finace
    iRate: zfd.numeric(z.number().optional()),
    tradeValue: zfd.numeric(z.number().optional()),
    discount: zfd.numeric(z.number().optional()),
    deposit: zfd.numeric(z.number().optional()),
    months: zfd.numeric(z.number().optional()),
    total: zfd.numeric(z.number().optional()),
    onTax: zfd.numeric(z.number().optional()),
    biweekly: zfd.numeric(z.number().optional()),
    on60: zfd.numeric(z.number().optional()),
    weekly: zfd.numeric(z.number().optional()),
    userId: zfd.text(z.string().optional()),
    user: zfd.text(z.string().optional()),
    name: zfd.text(z.string().optional()),
    address: zfd.text(z.string().optional()),
    intent: zfd.text(z.string().optional()),
    model: zfd.text(z.string().optional()),
    year: zfd.text(z.string().optional()),
    stockNum: zfd.text(z.string().optional()),
    labour: zfd.text(z.string().optional()),
    accessories: zfd.text(z.string().optional()),
    options: zfd.text(z.string().optional()),
    brand: zfd.text(z.string().optional()),
    trade: zfd.text(z.string().optional()),
    licensing: zfd.text(z.string().optional()),
    model1: zfd.text(z.string().optional()),
    msrp: zfd.text(z.string().optional()),
    freight: zfd.text(z.string().optional()),
    pdi: zfd.text(z.string().optional()),
    commodity: zfd.text(z.string().optional()),
    // dealer fees
    userExtWarr: zfd.text(z.string().optional()),
    userLicensing: zfd.text(z.string().optional()),
    userServicespkg: zfd.text(z.string().optional()),
    vinE: zfd.text(z.string().optional()),
    rustProofing: zfd.text(z.string().optional()),
    destinationCharge: zfd.text(z.string().optional()),
    userLoanProt: zfd.text(z.string().optional()),
    userTireandRim: zfd.text(z.string().optional()),
    userFreight: zfd.text(z.string().optional()),
    userAdmin: zfd.text(z.string().optional()),
    userGasOnDel: zfd.text(z.string().optional()),
    userOther: zfd.text(z.string().optional()),
    userAirTax: zfd.text(z.string().optional()),
    userTireTax: zfd.text(z.string().optional()),
    userFinance: zfd.text(z.string().optional()),
    userTax: zfd.text(z.string().optional()),
    userDemo: zfd.text(z.string().optional()),
    userGovern: zfd.text(z.string().optional()),
    userCommodity: zfd.text(z.string().optional()),
    userPDI: zfd.text(z.string().optional()),
    userLabour: zfd.text(z.string().optional()),
    subscriptions: zfd.text(z.string().optional()),
    customer: zfd.text(z.string().optional()),
})

const dealerfeesSchema = z.object({
    email: z.string().email(),
    userExtWarr: zfd.text(z.string().optional()),
    userLicensing: zfd.text(z.string().optional()),
    userServicespkg: zfd.text(z.string().optional()),
    vinE: zfd.text(z.string().optional()),
    rustProofing: zfd.text(z.string().optional()),
    destinationCharge: zfd.text(z.string().optional()),
    labour: zfd.text(z.string().optional()),
    userLoanProt: zfd.text(z.string().optional()),
    userTireandRim: zfd.text(z.string().optional()),
    userFreight: zfd.text(z.string().optional()),
    userAdmin: zfd.text(z.string().optional()),
    userGasOnDel: zfd.text(z.string().optional()),
    userOther: zfd.text(z.string().optional()),
    userAirTax: zfd.text(z.string().optional()),
    userTireTax: zfd.text(z.string().optional()),
    userFinance: zfd.text(z.string().optional()),
    userTax: zfd.text(z.string().optional()),
    userDemo: zfd.text(z.string().optional()),
    userGovern: zfd.text(z.string().optional()),
    userCommodity: zfd.text(z.string().optional()),
    userPDI: zfd.text(z.string().optional()),
    userLabour: zfd.text(z.string().optional()),
    id: zfd.text(z.string().optional()),
})

/* back up
import { json, redirect, type ActionFunction, DataFunctionArgs, LoaderFunction } from '@remix-run/node'
import { createSalesScript, createSuggestions, updateUser } from '#app/utils/user.server.ts'
import { z } from 'zod'
import { useUser } from '#app/utils/user.ts'
import { zfd } from 'zod-form-data'
import { requireUserId, sessionKey } from '#app/utils/auth.server.ts'
import { createFinance, getLatestFinance } from '#app/utils/quote.server.ts'
import { createSalesInput, getSalesData } from '#app/components/actions/dashboard.server.tsx';
import { getSession, commitSession } from '#app/utils/dsa.server.ts'
import stripe from 'stripe';
import { prisma } from '#app/utils/db.server.ts'

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export async function useUserLoader({ request }: DataFunctionArgs) {
    const userId = await requireUserId(request)
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },

    })
    return json({ user: { ...user, }, })
}



export const rootAction: ActionFunction = async ({ request }) => {
    const user = useUser;
    const email = user.email
    const finance = await getLatestFinance(email)
    const session = await getSession(request.headers.get("Cookie"));
    const formPayload = Object.fromEntries(await request.formData())
    const formInput = financeFormSchema.parse(formPayload)
    // update sales form on the side bar
    if (formInput.intent === 'updateSales') {
        const updateSalesData = await createSalesInput(formInput)
        return json({ updateSalesData })
    }
    // conact us form side bar
    if (formInput.intent === "sendSuggestions") {
        const sendSuggData = await createSuggestions(formInput)
        return json({ sendSuggData })
    }
    // conact us form side bar
    if (formInput.intent === "sendScripts") {
        const sendScriptData = await createSalesScript(formInput)
        return json({ sendScriptData })
    }
    // create switch quote
    if (formInput.brand === 'createSwitch') {
        return json({ financeCreated }), redirect('/overview/switch')
    }
}

export const rootLoader: ActionFunction = async ({ request }) => {
    const formPayload = Object.fromEntries(await request.formData())
    const inputs = financeFormSchema.parse(formPayload)
    const user = useUser
    if (user?.customerId === null) {
        const customer = await stripeInstance.customers.list({ email: user.email, limit: 1, });
        const customerId = customer.data[0].id;
        const subscriptions = await stripeInstance.subscriptions.list({
            status: "trialing" || "active",
            customer: customerId,
        });
        const subscriptionId = subscriptions.data[0].status
        if (subscriptionId === null) return redirect('https://buy.stripe.com/14k6pTg9J0IV0G4fYZ')
        const update = await updateUser({ inputs, 'subscriptionId': subscriptionId, 'customerId': customerId })
        return json({ ok: true, user, update })
    }
    if (inputs._action === 'welcomePageAction') {
        await updateUser(inputs)
        await createFinance({ brand: 'welcome', name: 'welcome', phone: '6136136134', email: 'example@example.com', model: 'welcome', year: 'welcome', freight: 750, commodity: 389, pdi: 289, licensing: 65, userEmail: user.email, })
        return redirect(('/welcome/profile'))
    }
    if (inputs._action === "updateWelcomeProfile") {
        await updateUser(inputs)
        return redirect('/welcome/dealerfees')
    }
    if (inputs._action === "updateWelcomeDF") {
        await updateUser(inputs)
        return redirect('/welcome/quote')
    }

}


export const financeFormSchema = z.object({
    // user
    id: zfd.text(z.string().optional()),
    fuser: zfd.text(z.string().optional()),
    lname: zfd.text(z.string().optional()),
    phone: zfd.text(z.string().optional()),
    email: z.string().email(),
    userEmail: zfd.text(z.string().optional()),
    subscriptionId: zfd.text(z.string().optional()),
    returning: zfd.text(z.string().optional()),
    _action: zfd.text(z.string().optional()),
    //finace
    iRate: zfd.numeric(z.number().optional()),
    tradeValue: zfd.numeric(z.number().optional()),
    discount: zfd.numeric(z.number().optional()),
    deposit: zfd.numeric(z.number().optional()),
    months: zfd.numeric(z.number().optional()),
    total: zfd.numeric(z.number().optional()),
    onTax: zfd.numeric(z.number().optional()),
    biweekly: zfd.numeric(z.number().optional()),
    on60: zfd.numeric(z.number().optional()),
    weekly: zfd.numeric(z.number().optional()),
    userId: zfd.text(z.string().optional()),
    user: zfd.text(z.string().optional()),
    name: zfd.text(z.string().optional()),
    address: zfd.text(z.string().optional()),
    intent: zfd.text(z.string().optional()),
    model: zfd.text(z.string().optional()),
    year: zfd.text(z.string().optional()),
    stockNum: zfd.text(z.string().optional()),
    labour: zfd.text(z.string().optional()),
    accessories: zfd.text(z.string().optional()),
    options: zfd.text(z.string().optional()),
    brand: zfd.text(z.string().optional()),
    trade: zfd.text(z.string().optional()),
    licensing: zfd.text(z.string().optional()),
    model1: zfd.text(z.string().optional()),
    msrp: zfd.text(z.string().optional()),
    freight: zfd.text(z.string().optional()),
    pdi: zfd.text(z.string().optional()),
    commodity: zfd.text(z.string().optional()),
    // dealer fees
    userExtWarr: zfd.text(z.string().optional()),
    userLicensing: zfd.text(z.string().optional()),
    userServicespkg: zfd.text(z.string().optional()),
    vinE: zfd.text(z.string().optional()),
    rustProofing: zfd.text(z.string().optional()),
    destinationCharge: zfd.text(z.string().optional()),
    userLoanProt: zfd.text(z.string().optional()),
    userTireandRim: zfd.text(z.string().optional()),
    userFreight: zfd.text(z.string().optional()),
    userAdmin: zfd.text(z.string().optional()),
    userGasOnDel: zfd.text(z.string().optional()),
    userOther: zfd.text(z.string().optional()),
    userAirTax: zfd.text(z.string().optional()),
    userTireTax: zfd.text(z.string().optional()),
    userFinance: zfd.text(z.string().optional()),
    userTax: zfd.text(z.string().optional()),
    userDemo: zfd.text(z.string().optional()),
    userGovern: zfd.text(z.string().optional()),
    userCommodity: zfd.text(z.string().optional()),
    userPDI: zfd.text(z.string().optional()),
    userLabour: zfd.text(z.string().optional()),


})

const dealerfeesSchema = z.object({
    email: z.string().email(),
    userExtWarr: zfd.text(z.string().optional()),
    userLicensing: zfd.text(z.string().optional()),
    userServicespkg: zfd.text(z.string().optional()),
    vinE: zfd.text(z.string().optional()),
    rustProofing: zfd.text(z.string().optional()),
    destinationCharge: zfd.text(z.string().optional()),
    labour: zfd.text(z.string().optional()),
    userLoanProt: zfd.text(z.string().optional()),
    userTireandRim: zfd.text(z.string().optional()),
    userFreight: zfd.text(z.string().optional()),
    userAdmin: zfd.text(z.string().optional()),
    userGasOnDel: zfd.text(z.string().optional()),
    userOther: zfd.text(z.string().optional()),
    userAirTax: zfd.text(z.string().optional()),
    userTireTax: zfd.text(z.string().optional()),
    userFinance: zfd.text(z.string().optional()),
    userTax: zfd.text(z.string().optional()),
    userDemo: zfd.text(z.string().optional()),
    userGovern: zfd.text(z.string().optional()),
    userCommodity: zfd.text(z.string().optional()),
    userPDI: zfd.text(z.string().optional()),
    userLabour: zfd.text(z.string().optional()),
    id: zfd.text(z.string().optional()),
})

*/
