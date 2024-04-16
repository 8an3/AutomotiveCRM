/* eslint-disable no-sequences */
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { redirect, json, type ActionFunction, type DataFunctionArgs, } from '@remix-run/node'
import { useParams } from '@remix-run/react';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { requireUserSession } from '~/helpers';

import { model } from '~/models'
import { deleteBMW, deleteFinance, deleteManitou } from '~/utils/finance/delete.server';
import { createFinance, createFinanceManitou, createBMWOptions, createBMWOptions2, } from "~/utils/finance/create.server";
import { createFinanceNote } from '~/utils/financeNote/create.server';
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getLatestFinance2, getLatestFinanceManitou, getDataKawasaki, getLatestBMWOptions, getLatestBMWOptions2, getDataBmwMoto, getDataByModel, getDataHarley, getDataTriumph, findQuoteById, findDashboardDataById, getDataByModelManitou, getLatestOptionsManitou } from "~/utils/finance/get.server";
import { updateFinance, updateFinanceManitou, } from "~/utils/finance/update.server";

import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'
import GetUserFromRequest from "~/utils/auth/getUser";


export async function optionsLoader({ request, params }: LoaderFunctionArgs) {
    let session = await getSession(request.headers.get("Cookie"));
    const email = session.get('email')
    const user = await GetUserFromRequest(request);
    if (!user) { return redirect('/login'); }


    const finance = await getLatestFinance2(email)

    if (finance && finance.brand === 'Manitou') {
        const finance = await getLatestFinanceManitou(email);
        return json({ ok: true, finance, user });
    }
    if (finance && finance.brand === 'Switch') {
        const finance = await getLatestFinanceManitou(email);
        return json({ ok: true, finance, user });
    }
    if (finance && finance.brand === 'BMW-Motorrad') {
        const finance = await getDataBmwMoto(email);
        return json({ ok: true, finance, user });
    }
    else {
        return null;
    }
}

export const optionsAction: ActionFunction = async ({ request }) => {
    const formPayload = Object.fromEntries(await request.formData())
    try {
        if (formPayload.brand === 'Manitou') {
            const creatingManitouOptions = financeFormSchema.parse(formPayload)
            const updatingFinance = await updateFinanceManitou(creatingManitouOptions)
            return json({ updatingFinance }), redirect(`/overview/Manitou`)
        }
        if (formPayload.brand === 'BMW-Motorrad') {
            const creatingBMWOptions = financeFormSchema.parse(formPayload)
            const updatingFinance = await updateFinanceManitou(creatingBMWOptions)
            return json({ updatingFinance }), redirect(`/overview/BMW-Motorrad`)
        }
        if (formPayload.brand === 'Switch') {
            const creatingManitouOptions = financeFormSchema.parse(formPayload)
            const updatingFinance = await updateFinanceManitou(creatingManitouOptions)
            return json({ updatingFinance }), redirect(`/overview/Switch`)
        }
        else {
            return null
        }
    } catch (error) {
        console.error(`quote not submitted ${error}`)
        return redirect(`/users/settings`)
    }
}


