import { z } from 'zod'
import { json, createCookie, createMemorySessionStorage, type ActionFunction, type DataFunctionArgs, LoaderFunction, redirect } from '@remix-run/node'
import { zfd } from 'zod-form-data'
import { prisma } from "~/libs";

import { requireUserRole, requireUserSession } from "~/helpers";
import { deleteBMW, deleteFinance, deleteManitou } from '~/utils/finance/delete.server';
import { createFinance, createFinanceManitou, createBMWOptions, createBMWOptions2, } from "~/utils/finance/create.server";
import { createFinanceNote } from '~/utils/financeNote/create.server';
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getLatestFinance, getLatestFinance2, getLatestFinanceManitou, getDataKawasaki, getLatestBMWOptions, getLatestBMWOptions2, getDataBmwMoto, getDataByModel, getDataHarley, getDataTriumph, findQuoteById, findDashboardDataById, getDataByModelManitou, getLatestOptionsManitou, getFinance } from "~/utils/finance/get.server";
import { updateFinance, updateFinanceManitou, } from "~/utils/finance/update.server";
import { getAllFinanceNotes } from '~/utils/financeNote/get.server';
import { deleteFinanceNote } from '~/utils/financeNote/delete.server';
import { updateFinanceNote } from '~/utils/financeNote/update.server';
import { createDashData } from '~/utils/dashboard/create.server';
import { updateDashData } from '~/utils/dashboard/update.server';
import { directClose, getCloses, assumptiveClose, alternativeClose, problemSolvingClose, emotionalClose, getOvercomes, feltClose, getFollowUp, getQualifying, getTexting, getStories, testDriveClose, upSellClose, questionClose, summaryClose, trialClose, getScriptsListItems, getLatestScripts } from '~/utils/scripts/get.server'
import { createSalesScript } from '~/utils/scripts/create.server'
import { getDashboard } from '~/utils/dashboard/get.server';
import { getLatestFinanceAndDashDataForClientfile } from '~/utils/client/getLatestFinance.server';


export async function utilsLoader({ request }) {
    const { user } = await requireUserSession(request);
    const userEmail = user.email
    const userId = user.id
    if (!userEmail) {
        const { user } = await requireUserSession(request);
        const userEmail = user.email
        const client = await getLatestFinanceAndDashDataForClientfile(userId)
        const finance = client.finance
        const modelData = await getDataByModel(finance)
        return json({ ok: true, user, finance, modelData, client })
    } else {
        const client = await getLatestFinanceAndDashDataForClientfile(userId)
        const finance = client.finance
        const modelData = await getDataByModel(finance)
        return json({ ok: true, user, finance, modelData, client })
    }
}
